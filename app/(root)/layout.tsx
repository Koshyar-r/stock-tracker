import Header from "@/components/Header"

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        <main className="min-h-screen text-gray-400">
            <Header />
            <div className="py-10 container">
                {children}
            </div>
        </main>
    )
}

export default layout