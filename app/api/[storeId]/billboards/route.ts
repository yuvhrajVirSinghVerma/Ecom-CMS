import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{params:{storeId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{label,imageUrl}=body
        if(!userId)return new NextResponse('Unauthenticated',{status:401})
        if(!label)return new NextResponse('label is Required',{status:400})
        if(!imageUrl)return new NextResponse('Image Url is Required',{status:400})
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
        const billboard=await prismadb.billboard.create({
            data:{
                label,imageUrl,
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboard)
    }catch(e){
        console.log("Billboard_POST ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{storeId:string}}){
    try{
        if(!params.storeId)return new NextResponse('Store Id is Required',{status:400})

        const billboard=await prismadb.billboard.findMany({
            where:{
               
                storeId:params.storeId
            }
        })
        return NextResponse.json(billboard)
    }catch(e){
        console.log("Billboard_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}