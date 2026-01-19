export default function SlideCard({ product, style, onClick }) {
    return (
        <div
            className="absolute w-[300px] h-[380px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between"
            style={style}
            onClick={onClick}
        >
            <div className="h-48 bg-gray-800/50 rounded-xl flex items-center justify-center p-4">
                <img
                    src={product.img}
                    alt={product.name}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="text-center mt-4">
                <h3 className="font-bold text-xl text-white truncate">
                    {product.name}
                </h3>
                <p className="text-primary font-black text-lg mt-2">{product.price}</p>
            </div>
        </div>
    );
}
