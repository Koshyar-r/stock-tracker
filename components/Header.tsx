import Image from "next/image"
import Link from "next/link"

const Header = () => {
    return (
        <header className="sticky top-0 header">
            <div className="container header-wrapper">
                <Link href="" className="flex items-center justify-center gap-4 text-white text-base sm:text-2xl font-bold">
                    <Image src="/assets/logo.png" alt="logo" width={150} height={40} className="h-8 w-auto cursor-pointer" />
                    MarketRadar
                </Link>
                <nav>
                    <p className="text-xs sm:text-lg text-white font-bold">STAY AHEAD OF THE MARKET</p>
                </nav>

            </div>
        </header>
    )
}

export default Header