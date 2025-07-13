import axios from "axios"
import { useEffect, useState } from "react"

function ImageGenerator({location}:{location:string}){
    const [image, setImage] = useState<string>("")

    useEffect(() => {
        const getImage = async () => {
            try{
                const response = await axios.get(`https://api.unsplash.com/search/photos?query=${location}&per_page=1&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`)
                const data = response.data
                setImage(data.results[0].urls.regular)
            }catch(error){
                console.log(error)
            }
        }
        getImage()
    }, [location])
    

    return image && <img src={image} alt="avatar" className="w-full h-full object-cover"/>
}

export default ImageGenerator