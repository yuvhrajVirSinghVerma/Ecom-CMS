import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request,{params}:{params:{storeId:string}}){
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
         if(!images || !images.length)return new NextResponse('Iamges are Required',{status:400})

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
        const product=await prismadb.product.create({
            data:{
                name,price,categoryId,sizeId,colorId,isFeatured,isArchived,
                storeId:params.storeId,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)
    }catch(e){
        console.log("PRODUCTS_POST ",e)
        return new NextResponse("Internal error",{status:500})
    }
}

export async function GET(req:Request,{params}:{params:{storeId:string}}){
    try{
        if(!params.storeId)return new NextResponse('Store Id is Required',{status:400})
            const {searchParams}=new URL(req.url)
        console.log("searchParams ",searchParams)
        const categoryId=searchParams.get('categoryId') || undefined
        const colorId=searchParams.get('colorId') || undefined
        const sizeId=searchParams.get('sizeId') || undefined
        const isFeatured=searchParams.get('isFeatured')

        console.log("categoryIds ",categoryId)

        const products=await prismadb.product.findMany({
            where:{
               
                storeId:params.storeId,
                categoryId,sizeId,colorId,
                isFeatured:isFeatured?true:undefined,
                isArchived:false
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        console.log("products ",products)
        return NextResponse.json(products)
    }catch(e){
        console.log("PRODUCTS_GET ",e)
        return new NextResponse("Internal error",{status:500})
    }
}