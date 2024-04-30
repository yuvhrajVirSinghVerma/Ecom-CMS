import prismadb from "@/lib/prismadb"
import { CategoryForm } from "./components/category-form"

const CategoryPage=async({params}:{params:{categoryId:string,storeId:string}})=>{
//we are getting redirected here by client.jsx where [billboardId] is "new" so int that case we will not get data from db, only if we are trying to edit the billboard then [billboardId]is id and will get the data from db 
    const category=await prismadb.category.findUnique({
        where:{
            id:params.categoryId
        }
    })

    const billboards=await prismadb.billboard.findMany({
        where:{
            storeId:params.storeId
        }
    })
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm
                initialData={category}
                billboards={billboards}
                />
            </div>

        </div>
    )
}
export default CategoryPage