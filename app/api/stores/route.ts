import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{name}=body
        if(!userId)return new NextResponse('Unauthorised',{status:401})
        if(!name)return new NextResponse('Name is Required',{status:400})

        const store=await prismadb.store.create({
            data:{
                name,userId
            }
        })
        return NextResponse.json(store)
    }catch(e){
        console.log("STORES_POST ",e)
        return new NextResponse("Internal error",{status:500})
    }
}