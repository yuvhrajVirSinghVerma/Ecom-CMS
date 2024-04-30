import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req:Request,{params}:{params:{productId:string}}){
    try{
       
        if(!params.productId)return new NextResponse('Product Id is Required',{status:400})

            
        const product=await prismadb.product.findUnique({
            where:{
                id:params.productId
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true
            }
        })
        return NextResponse.json(product)
    }catch(e){
        console.log("PRODUCT_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function PATCH(req:Request,{params}:{params:{storeId:string,productId:string}}){
    try{
        const {userId}=auth()
        console.log("userid ",userId)
        const body=await req.json()
        const{name,price,categoryId,sizeId,colorId,images,isFeatured,isArchived}=body

        if(!userId)return new NextResponse('Unauthenticated',{status:401})
            if(!name)return new NextResponse('Name is Required',{status:400})
                if(!price)return new NextResponse('price is Required',{status:400})
                if(!categoryId)return new NextResponse('category Id is Required',{status:400})
                if(!sizeId)return new NextResponse('size Id is Required',{status:400})
                if(!colorId)return new NextResponse('color Id is Required',{status:400})
                if(!params.productId)return new NextResponse('Product Id is Required',{status:400})

        const storeByUserId=await prismadb.store.findFirst({
            where:{
                userId,
                id:params.storeId
            }
        })

        if(!storeByUserId){
            return new NextResponse('UnAuthorised',{status:403})
        }
       await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                name,price,categoryId,sizeId,colorId,isFeatured,isArchived,
                images:{
                    deleteMany:{}
                }
                
            }
        })

        const product=await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[...images.map((image:{url:string})=>image)]
                    }
                }
            }
        })
        return NextResponse.json(product)
    }catch(e){
        console.log("PRODUCT_PATCH ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{storeId:string,productId:string}}){
    try{
        const{userId}=auth()
        if(!userId){
            return new NextResponse('Unauthenticated',{status:401})
        }
        if(!params.productId)return new NextResponse('product Id is Required',{status:400})

            const storeByUserId=await prismadb.store.findFirst({
                where:{
                    userId,
                    id:params.storeId
                }
            })
    
            if(!storeByUserId){
                return new NextResponse('UnAuthorised',{status:403})
            }
        const product=await prismadb.product.deleteMany({
            where:{
               
                id:params.productId
            }
        })
        return NextResponse.json(product)
    }catch(e){
        console.log("PRODUCT_DELETE ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

