import prismadb from "@/lib/prismadb"
import { ProductForm } from "./components/product-form"

const ProductPage=async({params}:{params:{productId:string,storeId:string}})=>{
//we are getting redirected here by client.jsx where [billboardId] is "new" so int that case we will not get data from db, only if we are trying to edit the billboard then [billboardId]is id and will get the data from db 
    const product=await prismadb.product.findUnique({
        where:{
            id:params.productId
        },
        include:{
            images:true
        }
    })

    const categories=await prismadb.category.findMany({
        where:{
            storeId:params.storeId
        }
    })
    const sizes=await prismadb.size.findMany({
        where:{
            storeId:params.storeId
        }
    })
    const colors=await prismadb.color.findMany({
        where:{
            storeId:params.storeId
        }
    })
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                categories={categories}
                colors={colors}
                sizes={sizes}
                initialData={product}
                />
            </div>

        </div>
    )
}
export default ProductPage