DELETE FROM posts;

INSERT INTO tags (name, slug) VALUES
    ('SOLID', 'solid'),
    ('DDD', 'ddd')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (
    title, slug, summary, content, cover_image_url, status, featured,
    category_id, published_at, reading_time
)
SELECT
    'SOLID na prática: refatorando um serviço Java passo a passo',
    'solid-na-pratica-refatorando-um-servico-java-passo-a-passo',
    'Entenda os cinco princípios SOLID através da evolução de um serviço de pedidos — com exemplos Java, decisões e trade-offs reais.',
    $solid$
# SOLID na prática: refatorando um serviço Java passo a passo

SOLID não é uma coleção de regras para deixar o código “mais bonito”. É um conjunto de princípios para controlar o custo da mudança. Neste artigo, vamos partir de um serviço de pedidos que funciona, mas concentra responsabilidades demais, e evoluí-lo sem criar uma arquitetura desnecessariamente complexa.

> O objetivo não é aplicar todos os princípios em todas as classes. É reconhecer os sinais de acoplamento e escolher uma separação que torne a próxima mudança mais segura.

## O ponto de partida

Imagine que uma aplicação precisa validar um pedido, calcular o total, salvar os dados e enviar um e-mail:

```java
public class OrderService {
    public void checkout(Order order) {
        if (order.items().isEmpty()) {
            throw new IllegalArgumentException("O pedido precisa ter itens");
        }

        BigDecimal total = order.items().stream()
            .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        DriverManager.getConnection("jdbc:postgresql://localhost/store")
            .prepareStatement("INSERT INTO orders ...")
            .executeUpdate();

        new SmtpClient().send(
            order.customerEmail(),
            "Pedido confirmado: " + total
        );
    }
}
```

Esse código pode entregar a primeira versão do produto. O problema aparece na segunda: desconto por campanha, pagamento via Pix, troca do PostgreSQL, reenvio de notificação ou testes sem infraestrutura. Cada alteração toca a mesma classe e pode quebrar comportamentos que não têm relação entre si.

## S — Single Responsibility Principle

O princípio da responsabilidade única afirma que um módulo deve ter **um único motivo para mudar**. “Fazer checkout” é o caso de uso; validar, persistir e notificar são responsabilidades colaboradoras.

```java
public final class CheckoutService {
    private final OrderValidator validator;
    private final PricingService pricing;
    private final OrderRepository repository;
    private final OrderNotifier notifier;

    public CheckoutService(
        OrderValidator validator,
        PricingService pricing,
        OrderRepository repository,
        OrderNotifier notifier
    ) {
        this.validator = validator;
        this.pricing = pricing;
        this.repository = repository;
        this.notifier = notifier;
    }

    public Order checkout(Order order) {
        validator.validate(order);
        Order pricedOrder = order.withTotal(pricing.calculate(order));
        Order savedOrder = repository.save(pricedOrder);
        notifier.confirm(savedOrder);
        return savedOrder;
    }
}
```

Agora o serviço descreve o fluxo do caso de uso. Detalhes como SQL e SMTP ficaram nas bordas. Isso também melhora os testes: podemos substituir as dependências por doubles sem subir banco ou servidor de e-mail.

## O — Open/Closed Principle

Código deve estar aberto para extensão e fechado para modificação. Isso não significa prever todas as possibilidades; significa criar um ponto de extensão quando já existe uma variação real.

Considere o cálculo de desconto. Um grande bloco de `if` cresce a cada campanha. Uma estratégia torna a variação explícita:

```java
public interface DiscountPolicy {
    boolean appliesTo(Order order);
    BigDecimal discountFor(Order order);
}

public final class PricingService {
    private final List<DiscountPolicy> policies;

    public PricingService(List<DiscountPolicy> policies) {
        this.policies = List.copyOf(policies);
    }

    public BigDecimal calculate(Order order) {
        BigDecimal subtotal = order.subtotal();
        BigDecimal discount = policies.stream()
            .filter(policy -> policy.appliesTo(order))
            .map(policy -> policy.discountFor(order))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return subtotal.subtract(discount).max(BigDecimal.ZERO);
    }
}
```

Uma nova campanha adiciona uma implementação de `DiscountPolicy`. O fluxo principal permanece estável. Evite, porém, criar interfaces para coisas que nunca variam: abstração sem evidência aumenta o custo cognitivo.

## L — Liskov Substitution Principle

Se uma classe implementa um contrato, ela precisa respeitar as expectativas desse contrato. O consumidor não deveria descobrir que uma implementação “especial” lança uma exceção para uma operação prometida.

Este contrato é problemático:

```java
public interface PaymentMethod {
    Payment authorize(Money amount);
    void refund(Payment payment);
}
```

Se boleto não suporta estorno imediato, sua implementação será forçada a lançar `UnsupportedOperationException`. O contrato mente. Uma solução é separar capacidades:

```java
public interface PaymentAuthorizer {
    Payment authorize(Money amount);
}

public interface RefundablePayment {
    void refund(Payment payment);
}
```

Agora cada implementação assume apenas as garantias que consegue cumprir. LSP é menos sobre herança e mais sobre **preservar contratos e expectativas observáveis**.

## I — Interface Segregation Principle

Clientes não devem depender de métodos que não usam. Interfaces pequenas, orientadas ao consumidor, reduzem acoplamento:

| Interface ampla | Interfaces orientadas ao uso |
|---|---|
| `OrderOperations` | `OrderReader` |
| `find`, `save`, `delete`, `export`, `notify` | `OrderWriter` |
| Todos dependem de tudo | Cada caso de uso depende do necessário |

```java
public interface OrderReader {
    Optional<Order> findById(OrderId id);
}

public interface OrderWriter {
    Order save(Order order);
}
```

Um relatório precisa apenas de `OrderReader`; ele não ganha, por acidente, a capacidade de alterar pedidos.

## D — Dependency Inversion Principle

O caso de uso não deve depender diretamente de PostgreSQL, SMTP ou SDKs externos. Ele depende de contratos definidos perto da regra de negócio; adaptadores implementam esses contratos.

```java
public interface OrderRepository {
    Order save(Order order);
}

@Repository
public class JpaOrderRepository implements OrderRepository {
    private final SpringDataOrderRepository database;

    public JpaOrderRepository(SpringDataOrderRepository database) {
        this.database = database;
    }

    @Override
    public Order save(Order order) {
        return OrderMapper.toDomain(database.save(OrderMapper.toEntity(order)));
    }
}
```

A direção da dependência fica assim:

```text
Controller → CheckoutService → OrderRepository ← JpaOrderRepository
                    ↓
              OrderNotifier ← SmtpOrderNotifier
```

O domínio conhece contratos, não detalhes externos. Spring faz a composição das implementações na inicialização.

## Um teste que mostra o resultado

```java
@Test
void completesCheckoutAndNotifiesCustomer() {
    var repository = mock(OrderRepository.class);
    var notifier = mock(OrderNotifier.class);
    var service = new CheckoutService(
        new OrderValidator(),
        new PricingService(List.of()),
        repository,
        notifier
    );

    var order = OrderFixture.validOrder();
    when(repository.save(any())).thenAnswer(call -> call.getArgument(0));

    Order result = service.checkout(order);

    assertThat(result.total()).isEqualByComparingTo("120.00");
    verify(repository).save(any(Order.class));
    verify(notifier).confirm(result);
}
```

O teste descreve o comportamento importante sem depender de PostgreSQL ou SMTP. Isso é consequência de um design com limites claros, não o objetivo isolado de “usar mocks”.

## Sinais de que a refatoração vale a pena

- A mesma classe muda por razões diferentes.
- Um novo comportamento exige editar uma sequência crescente de condicionais.
- Implementações quebram métodos prometidos pelo contrato.
- Consumidores recebem dependências ou permissões que não usam.
- Regras de negócio importam frameworks, drivers ou SDKs diretamente.

## Conclusão

SOLID funciona melhor como vocabulário para discutir design. SRP ajuda a encontrar limites; OCP organiza variações reais; LSP protege contratos; ISP reduz dependências acidentais; DIP mantém regras importantes independentes de infraestrutura.

Comece pequeno: escolha uma classe que muda demais, escreva um teste que proteja o comportamento e extraia uma única responsabilidade. O melhor design não é o que contém mais padrões — é o que permite mudar o software com confiança.
    $solid$,
    NULL,
    'PUBLISHED',
    TRUE,
    c.id,
    NOW() - INTERVAL '1 day',
    9
FROM categories c
WHERE c.slug = 'arquitetura';

INSERT INTO posts (
    title, slug, summary, content, cover_image_url, status, featured,
    category_id, published_at, reading_time
)
SELECT
    'DDD além das entidades: modelando um domínio com clareza',
    'ddd-alem-das-entidades-modelando-um-dominio-com-clareza',
    'Um guia prático de Domain-Driven Design: linguagem ubíqua, agregados, value objects, eventos e limites que protegem as regras do negócio.',
    $ddd$
# DDD além das entidades: modelando um domínio com clareza

Domain-Driven Design costuma ser apresentado como uma lista de padrões: entidade, value object, agregado, repository e domain service. Mas DDD começa antes do código. Seu objetivo é criar um modelo compartilhado que ajude especialistas de negócio e desenvolvedores a tomar decisões sem traduzir a mesma ideia de formas diferentes.

Neste artigo vamos modelar parte de um sistema de assinaturas. A pergunta central não será “qual annotation JPA usar?”, mas sim: **quais regras precisam permanecer verdadeiras e onde elas devem viver?**

## Comece pela linguagem ubíqua

Uma conversa inicial pode revelar frases importantes:

- “Uma assinatura começa em período de teste.”
- “O cliente pode trocar de plano, mas o benefício só vale no próximo ciclo.”
- “Uma assinatura inadimplente não pode ser renovada.”
- “Cancelar impede novas cobranças, mas não apaga o histórico.”

Essas frases formam a linguagem ubíqua. Termos como `Subscription`, `TrialPeriod`, `BillingCycle` e `Cancellation` devem aparecer nas conversas, histórias, testes e código com o mesmo significado.

> Se o time usa três palavras diferentes para a mesma coisa, provavelmente existem três modelos mentais concorrendo dentro do sistema.

## Value objects tornam conceitos explícitos

Usar `String` para e-mail e `BigDecimal` para preço permite estados inválidos. Um value object valida o conceito na criação e é comparado por valor.

```java
public record Money(BigDecimal amount, Currency currency) {
    public Money {
        Objects.requireNonNull(amount);
        Objects.requireNonNull(currency);
        if (amount.signum() < 0) {
            throw new IllegalArgumentException("O valor não pode ser negativo");
        }
        amount = amount.setScale(2, RoundingMode.HALF_EVEN);
    }

    public Money add(Money other) {
        requireSameCurrency(other);
        return new Money(amount.add(other.amount), currency);
    }

    private void requireSameCurrency(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Moedas diferentes");
        }
    }
}
```

O objeto não é apenas um contêiner. Ele centraliza invariantes e operações válidas. Depois de criado, qualquer `Money` do sistema é confiável.

Outros candidatos comuns são:

| Conceito | Possível value object |
|---|---|
| Identidade | `SubscriptionId`, `CustomerId` |
| Contato | `EmailAddress`, `PhoneNumber` |
| Intervalo | `DateRange`, `BillingCycle` |
| Medida | `Money`, `Percentage`, `Quantity` |

## Entidades têm identidade e ciclo de vida

Duas assinaturas com o mesmo plano continuam sendo assinaturas diferentes. A identidade permanece enquanto seus atributos mudam.

```java
public final class Subscription {
    private final SubscriptionId id;
    private final CustomerId customerId;
    private Plan plan;
    private SubscriptionStatus status;
    private LocalDate nextBillingDate;

    private Subscription(
        SubscriptionId id,
        CustomerId customerId,
        Plan plan,
        LocalDate nextBillingDate
    ) {
        this.id = id;
        this.customerId = customerId;
        this.plan = plan;
        this.status = SubscriptionStatus.TRIAL;
        this.nextBillingDate = nextBillingDate;
    }

    public static Subscription startTrial(
        CustomerId customerId,
        Plan plan,
        LocalDate today
    ) {
        return new Subscription(
            SubscriptionId.newId(),
            customerId,
            plan,
            today.plusDays(14)
        );
    }
}
```

O método de fábrica expressa a intenção do negócio. Não existe construtor vazio público capaz de criar uma assinatura sem cliente, plano ou próxima cobrança.

## Agregados protegem invariantes

Um agregado é uma fronteira de consistência. Objetos externos só alteram seu estado através da raiz — neste caso, `Subscription`.

```java
public void renew(LocalDate today) {
    if (status == SubscriptionStatus.CANCELED) {
        throw new DomainException("Assinatura cancelada não pode ser renovada");
    }
    if (status == SubscriptionStatus.PAST_DUE) {
        throw new DomainException("Regularize o pagamento antes de renovar");
    }
    if (today.isBefore(nextBillingDate)) {
        throw new DomainException("O ciclo atual ainda não terminou");
    }

    status = SubscriptionStatus.ACTIVE;
    nextBillingDate = nextBillingDate.plusMonths(1);
    events.add(new SubscriptionRenewed(id, nextBillingDate));
}
```

As condições que precisam ser atômicas ficam dentro da fronteira. Isso orienta inclusive a transação: normalmente um comando carrega e salva um agregado por vez.

### Como escolher uma fronteira

Pergunte:

1. Quais dados precisam estar consistentes imediatamente?
2. Qual objeto representa a porta de entrada das mudanças?
3. O que pode ser atualizado depois, por evento?
4. O agregado continua pequeno o suficiente para ser carregado e salvo?

Um erro comum é transformar todo o diagrama de classes em um único agregado. Isso produz transações grandes, contenção e um modelo difícil de evoluir.

## Repository é uma coleção orientada ao domínio

O domínio precisa recuperar e persistir assinaturas, mas não precisa conhecer `JpaRepository`.

```java
public interface SubscriptionRepository {
    Optional<Subscription> findById(SubscriptionId id);
    void save(Subscription subscription);
}
```

O adaptador de infraestrutura implementa a porta:

```java
@Repository
class JpaSubscriptionRepository implements SubscriptionRepository {
    private final SpringDataSubscriptionRepository database;

    @Override
    public Optional<Subscription> findById(SubscriptionId id) {
        return database.findById(id.value()).map(SubscriptionMapper::toDomain);
    }

    @Override
    public void save(Subscription subscription) {
        database.save(SubscriptionMapper.toEntity(subscription));
    }
}
```

Separar o modelo de domínio da entidade JPA não é obrigatório em todo projeto. Vale a pena quando o mapeamento começa a distorcer o modelo ou quando as regras são complexas. Em um CRUD simples, uma separação total pode custar mais do que entrega.

## Application service coordena o caso de uso

A camada de aplicação controla a transação e a sequência; o agregado toma decisões de negócio.

```java
@Service
public class RenewSubscriptionHandler {
    private final SubscriptionRepository subscriptions;
    private final Clock clock;

    @Transactional
    public void handle(RenewSubscription command) {
        Subscription subscription = subscriptions
            .findById(command.subscriptionId())
            .orElseThrow(() -> new NotFoundException("Assinatura não encontrada"));

        subscription.renew(LocalDate.now(clock));
        subscriptions.save(subscription);
    }
}
```

Observe a divisão:

- O handler sabe **quando** carregar e salvar.
- A assinatura sabe **se** pode renovar e **como** seu estado muda.
- O repository sabe **como** persistir.

## Eventos de domínio desacoplam consequências

Depois da renovação, talvez seja necessário emitir uma nota, enviar e-mail e atualizar métricas. Essas ações não precisam fazer parte da mesma decisão atômica.

```java
public record SubscriptionRenewed(
    SubscriptionId subscriptionId,
    LocalDate nextBillingDate
) implements DomainEvent {}
```

Um handler publica o evento somente após a persistência. Consumidores reagem de forma independente. Em sistemas que não podem perder eventos, use o padrão **Transactional Outbox**: grave o agregado e o evento na mesma transação e publique depois.

```text
Comando → Application Service → Agregado
                 ↓                 ↓
             Repository       Domain Event
                 ↓                 ↓
            PostgreSQL      Outbox → Consumidores
```

## Bounded contexts evitam um modelo universal

“Cliente” não significa a mesma coisa em todos os lugares:

- Em **Assinaturas**, ele possui plano e estado de cobrança.
- Em **Suporte**, ele possui tickets e prioridade.
- Em **Fiscal**, ele possui documento e endereço tributário.

Cada bounded context mantém seu modelo e vocabulário. Integrações usam contratos explícitos, não entidades compartilhadas pelo banco.

| Contexto | Responsabilidade | Termos principais |
|---|---|---|
| Assinaturas | Ciclo do plano | assinatura, renovação, cancelamento |
| Cobrança | Transações financeiras | fatura, pagamento, inadimplência |
| Catálogo | Oferta comercial | plano, benefício, preço |

Essa separação é estratégica. Você pode implementar todos os contextos no mesmo monólito modular antes de considerar serviços separados.

## Teste regras, não detalhes

```java
@Test
void doesNotRenewAPastDueSubscription() {
    Subscription subscription = SubscriptionFixture.pastDue();

    assertThatThrownBy(() -> subscription.renew(LocalDate.parse("2026-09-26")))
        .isInstanceOf(DomainException.class)
        .hasMessage("Regularize o pagamento antes de renovar");
}
```

Esse teste executa rápido e documenta uma regra na linguagem do negócio. Testes de integração separados verificam mapeamento JPA, migrations e consultas.

## Quando DDD faz sentido

DDD tende a pagar seu custo quando:

- Regras e exceções de negócio são a parte difícil do sistema.
- O vocabulário muda conforme o time aprende.
- Existem áreas com significados diferentes para termos parecidos.
- Decisões precisam ser rastreáveis e protegidas por invariantes.

Para cadastro simples, painel interno ou protótipo descartável, um modelo transacional direto pode ser melhor. DDD não é uma meta de maturidade; é uma resposta à complexidade do domínio.

## Conclusão

Um bom modelo de domínio transforma conversas em código: nomes refletem a linguagem ubíqua, value objects impedem estados inválidos, agregados protegem invariantes e eventos conectam consequências sem misturar responsabilidades.

Comece por uma regra importante, não por pastas. Converse com quem conhece o negócio, escreva exemplos concretos e modele a menor fronteira capaz de manter a regra verdadeira. A arquitetura aparece como consequência da compreensão.
    $ddd$,
    NULL,
    'PUBLISHED',
    TRUE,
    c.id,
    NOW(),
    11
FROM categories c
WHERE c.slug = 'arquitetura';

INSERT INTO posts_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
JOIN tags t ON t.slug IN ('java', 'spring-boot', 'testes', 'solid')
WHERE p.slug = 'solid-na-pratica-refatorando-um-servico-java-passo-a-passo';

INSERT INTO posts_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
JOIN tags t ON t.slug IN ('java', 'spring-boot', 'postgresql', 'ddd')
WHERE p.slug = 'ddd-alem-das-entidades-modelando-um-dominio-com-clareza';
