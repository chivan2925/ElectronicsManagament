import ram1 from "../../assets/ram1.png";

export default function ProductCard({ product }) {
    const displayProduct = product || {
        name: "Tên sản phẩm mẫu",
        price: "10.000.000đ",
        imageUrl: ram1
    };

    return (
        <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 
                        flex flex-col h-full
                        transition-all duration-300 ease-in-out
                        shadow-lg shadow-transparent 
                        hover:shadow-primary/30 hover:scale-[1.03] hover:-translate-y-3 hover:cursor-pointer">
            <div className="w-full h-48 flex items-center justify-center p-4 bg-neutral-900/50 ">
                <img src={displayProduct.imageUrl} alt={displayProduct.name} className="max-h-full max-w-full object-contain rounded-xl" />
            </div>
            <div className="p-4 text-light flex flex-col flex-grow">
                <h3 className="text-base font-semibold truncate mb-2 flex-grow" title={displayProduct.name}>
                    {displayProduct.name}
                </h3>
                <p className="text-lg font-bold text-primary mb-4">
                    {displayProduct.price}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm font-semibold mt-auto"> 
                    <button className="w-full p-2 bg-primary text-black rounded-md hover:bg-opacity-80 transition-colors">
                        Thêm vào giỏ
                    </button>
                    <button className="w-full p-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition-colors">
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
}