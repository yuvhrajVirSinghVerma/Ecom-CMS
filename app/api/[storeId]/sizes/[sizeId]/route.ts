import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req:Request,{params}:{params:{sizeId:string}}){
    try{
       
        if(!params.sizeId)return new NextResponse('size Id is Required',{status:400})

            
        const size=await prismadb.size.findUnique({
            where:{
                id:params.sizeId
            }
        })
        return NextResponse.json(size)
    }catch(e){
        console.log("size_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(req:Request,{params}:{params:{storeId:string,sizeId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{name,value}=body
        if(!userId)return new NextResponse('Unauthenticated',{status:401})
        if(!name)return new NextResponse('name is Required',{status:400})
        if(!value)return new NextResponse('value is Required',{status:400})
        if(!params.sizeId)return new NextResponse('size Id is Required',{status:400})

        const storeByUserId=await prismadb.store.findFirst({
            where:{
                userId,
                id:params.storeId
            }
        })

        if(!storeByUserId){
            return new NextResponse('UnAuthorised',{status:403})
        }
        const size=await prismadb.size.updateMany({
            where:{
                id:params.sizeId
            },
            data:{
                name,value,
                
            }
        })
        return NextResponse.json(size)
    }catch(e){
        console.log("size_PATCH ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,sizeId:string}}){
    try{
        const{userId}=auth()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!params.sizeId)return new NextResponse('size Id is Required',{status:400})

            const storeByUserId=await prismadb.store.findFirst({
                where:{
                    userId,
                    id:params.storeId
                }
            })
    
            if(!storeByUserId){
                return new NextResponse('UnAuthorised',{status:403})
            }
        const size=await prismadb.size.deleteMany({
            where:{
               
                id:params.sizeId
            }
        })
        return NextResponse.json(size)
    }catch(e){
        console.log("size_DELETE ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

