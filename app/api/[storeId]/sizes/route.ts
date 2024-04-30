import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{params:{storeId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{name,value}=body
        if(!userId)return new NextResponse('Unauthenticated',{status:401})
        if(!name)return new NextResponse('name is Required',{status:400})
        if(!value)return new NextResponse('value is Required',{status:400})
        if(!params.storeId)return new NextResponse('Store Id is Required',{status:400})

        const storeByUserId=await prismadb.store.findFirst({
            where:{
                userId,
                id:params.storeId
            }
        })

        if(!storeByUserId){
            return new NextResponse('UnAuthorised',{status:403})
        }
        const size=await prismadb.size.create({
            data:{
                name,value,
                storeId:params.storeId
            }
        })
        return NextResponse.json(size)
    }catch(e){
        console.log("size_POST ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{storeId:string}}){
    try{
        if(!params.storeId)return new NextResponse('Store Id is Required',{status:400})

        const sizes=await prismadb.size.findMany({
            where:{
               
                storeId:params.storeId
            }
        })
        return NextResponse.json(sizes)
    }catch(e){
        console.log("sizes_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}