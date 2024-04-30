import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{params:{storeId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{name,billboardId}=body
        console.log("{name,billboardId}",{name,billboardId})
        if(!userId)return new NextResponse('Unauthenticated',{status:401})
        if(!name)return new NextResponse('Name is Required',{status:400})
        if(!billboardId)return new NextResponse('Billboard Id is Required',{status:400})
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
        const category=await prismadb.category.create({
            data:{
                name,billboardId,
                storeId:params.storeId
            }
        })
        return NextResponse.json(category)
    }catch(e){
        console.log("category_POST ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{storeId:string}}){
    try{
        if(!params.storeId)return new NextResponse('Store Id is Required',{status:400})

        const categories=await prismadb.category.findMany({
            where:{
               
                storeId:params.storeId
            }
        })
        return NextResponse.json(categories)
    }catch(e){
        console.log("categories_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}