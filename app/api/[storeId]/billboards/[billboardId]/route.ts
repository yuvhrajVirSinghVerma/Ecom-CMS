import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req:Request,{params}:{params:{billboardId:string}}){
    try{
       
        if(!params.billboardId)return new NextResponse('Billboard Id is Required',{status:400})

            
        const billboard=await prismadb.billboard.findUnique({
            where:{
                id:params.billboardId
            }
        })
        return NextResponse.json(billboard)
    }catch(e){
        console.log("Billboard_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(req:Request,{params}:{params:{storeId:string,billboardId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{label,imageUrl}=body
        if(!userId)return new NextResponse('Unauthenticated',{status:401})
        if(!label)return new NextResponse('label is Required',{status:400})
        if(!imageUrl)return new NextResponse('Image Url is Required',{status:400})
        if(!params.billboardId)return new NextResponse('Billboard Id is Required',{status:400})

        const storeByUserId=await prismadb.store.findFirst({
            where:{
                userId,
                id:params.storeId
            }
        })

        if(!storeByUserId){
            return new NextResponse('UnAuthorised',{status:403})
        }
        const billboard=await prismadb.billboard.updateMany({
            where:{
                id:params.billboardId
            },
            data:{
                label,imageUrl,
                
            }
        })
        return NextResponse.json(billboard)
    }catch(e){
        console.log("Billboard_PATCH ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,billboardId:string}}){
    try{
        const{userId}=auth()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!params.billboardId)return new NextResponse('Billboard Id is Required',{status:400})

            const storeByUserId=await prismadb.store.findFirst({
                where:{
                    userId,
                    id:params.storeId
                }
            })
    
            if(!storeByUserId){
                return new NextResponse('UnAuthorised',{status:403})
            }
        const billboard=await prismadb.billboard.deleteMany({
            where:{
               
                id:params.billboardId
            }
        })
        return NextResponse.json(billboard)
    }catch(e){
        console.log("Billboard_DELETE ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

