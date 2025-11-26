import { Button, Card, Image, Text } from "@chakra-ui/react"

const CardPost = () => {
    return (
        <Card.Root className="w-[300px] h-[400px]" maxW="sm" overflow="hidden">
            <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Green double couch with wooden legs"
            />
            <Card.Body gap="2">
                <Card.Title>Living room Sofa</Card.Title>
                <Card.Description>
                    This sofa is perfect for modern tropical spaces, baroque inspired
                    spaces.
                </Card.Description>
            </Card.Body>
            <Card.Footer gap="2">
                <Button variant="solid">Veja mais</Button>
            </Card.Footer>
        </Card.Root>
    )
}

export default CardPost;
