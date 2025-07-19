import "./globals.css";
import { Provider } from "../components/ui/provider"
import Menu from "../components/Menu/Menu";
import Footer from "../components/Footer/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html suppressHydrationWarning lang="pt-BR">
            <body>
                <Provider>
                    <Menu/>
                    {children}
                    <Footer/>
                </Provider>
            </body>
        </html>
    );
}
