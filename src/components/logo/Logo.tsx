import Link from "next/link";

export function Logo (){
    return(
        <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-green-500">Vol</span>tix
          </Link>
        </div>
    )
}