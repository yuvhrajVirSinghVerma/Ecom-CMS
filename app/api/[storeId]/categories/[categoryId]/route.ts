import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req:Request,{params}:{params:{categoryId:string}}){
    try{
       
        if(!params.categoryId)return new NextResponse('category Id is Required',{status:400})

            
        const category=await prismadb.category.findUnique({
            where:{
                id:params.categoryId
            },
            include:{
                billboard:true
            }
        })
        return NextResponse.json(category)
    }catch(e){
        console.log("category_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(req:Request,{params}:{params:{storeId:string,categoryId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{name,billboardId}=body
        if(!userId)return new NextResponse('Unauthenticated',{status:401})
        if(!name)return new NextResponse('Name is Required',{status:400})
        if(!billboardId)return new NextResponse('Billboard Id is Required',{status:400})
        if(!params.categoryId)return new NextResponse('category Id is Required',{status:400})

        const storeByUserId=await prismadb.store.findFirst({
            where:{
                userId,
                id:params.storeId
            }
        })

        if(!storeByUserId){
            return new NextResponse('UnAuthorised',{status:403})
        }
        const category=await prismadb.category.updateMany({
            where:{
                id:params.categoryId
            },
            data:{
                name,billboardId,
                
            }
        })
        return NextResponse.json(category)
    }catch(e){
        console.log("category_PATCH ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,categoryId:string}}){
    try{
        const{userId}=auth()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!params.categoryId)return new NextResponse('category Id is Required',{status:400})

            const storeByUserId=await prismadb.store.findFirst({
                where:{
                    userId,
                    id:params.storeId
                }
            })
    
            if(!storeByUserId){
                return new NextResponse('UnAuthorised',{status:403})
            }
        const category=await prismadb.category.deleteMany({
            where:{
               
                id:params.categoryId
            }
        })
        return NextResponse.json(category)
    }catch(e){
        console.log("category_DELETE ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

