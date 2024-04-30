import prismadb from "@/lib/prismadb"
import { ColorForm } from "./components/color-form"

const ColorPage=async({params}:{params:{colorId:string}})=>{
//we are getting redirected here by client.jsx where [billboardId] is "new" so int that case we will not get data from db, only if we are trying to edit the billboard then [billboardId]is id and will get the data from db 
    const color=await prismadb.color.findUnique({
        where:{
            id:params.colorId
        }
    })
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm
                initialData={color}
                />
            </div>

        </div>
    )
}
export default ColorPage