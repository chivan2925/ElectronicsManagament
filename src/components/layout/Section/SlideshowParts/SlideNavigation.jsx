import { GrPrevious, GrNext } from "react-icons/gr";

export default function SlideNavigation({ onPrev, onNext }) {
    return (
        <div className="flex gap-10 mt-12 z-50">
            <button
                onClick={onPrev}
                className="p-4 bg-white/5 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all active:scale-90"
            >
                <GrPrevious className="text-2xl" />
            </button>
            <button
                onClick={onNext}
                className="p-4 bg-white/5 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all active:scale-90"
            >
                <GrNext className="text-2xl" />
            </button>
        </div>
    );
}
