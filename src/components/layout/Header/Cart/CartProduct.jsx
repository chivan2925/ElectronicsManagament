import { MdDelete } from "react-icons/md";

export default function CartProduct({id,name, price, quantity, image,onDelete}){
    
    const handleQuantityChange = (e) => {
        e.stopPropagation(); // Ngăn đóng Cart
        console.log("Số lượng mới:", e.target.value);
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Ngăn đóng Cart
        onDelete(id);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:shadow-md transition-shadow bg-white">
            
            <img 
                src={image} 
                alt={name} 
                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate text-gray-800">
                    {name}
                </h4>
                <p className="text-red-600 font-semibold text-base mt-1">
                    {price}
                </p>
            </div>
            
            <input 
                type="number" 
                value={quantity}
                onChange={handleQuantityChange}
                onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào input
                min="1"
                className="w-14 h-9 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <MdDelete 
                onClick={handleDelete} 
                className="text-red-700 cursor-pointer hover:text-red-800 transition-colors flex-shrink-0" 
                size={30} 
            />
            
        </div>
    )
}