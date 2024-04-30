import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req:Request,{params}:{params:{colorId:string}}){
    try{
       
        if(!params.colorId)return new NextResponse('color Id is Required',{status:400})

            
        const color=await prismadb.color.findUnique({
            where:{
                id:params.colorId
            }
        })
        return NextResponse.json(color)
    }catch(e){
        console.log("color_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(req:Request,{params}:{params:{storeId:string,colorId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{name,value}=body
        if(!userId)return new NextResponse('Unauthenticated',{status:401})
        if(!name)return new NextResponse('name is Required',{status:400})
        if(!value)return new NextResponse('value is Required',{status:400})
        if(!params.colorId)return new NextResponse('color Id is Required',{status:400})

        const storeByUserId=await prismadb.store.findFirst({
            where:{
                userId,
                id:params.storeId
            }
        })

        if(!storeByUserId){
            return new NextResponse('UnAuthorised',{status:403})
        }
        const color=await prismadb.color.updateMany({
            where:{
                id:params.colorId
            },
            data:{
                name,value,
                
            }
        })
        return NextResponse.json(color)
    }catch(e){
        console.log("color_PATCH ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,colorId:string}}){
    try{
        const{userId}=auth()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!params.colorId)return new NextResponse('color Id is Required',{status:400})

            const storeByUserId=await prismadb.store.findFirst({
                where:{
                    userId,
                    id:params.storeId
                }
            })
    
            if(!storeByUserId){
                return new NextResponse('UnAuthorised',{status:403})
            }
        const color=await prismadb.color.deleteMany({
            where:{
               
                id:params.colorId
            }
        })
        return NextResponse.json(color)
    }catch(e){
        console.log("color_DELETE ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

