export default function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-12 flex justify-center">
      <ul className="flex items-center -space-x-px h-10 text-base">
        {Array.from({ length: totalPages }, (_, i) => {
          const pageNumber = i + 1;

          return (
            <li key={pageNumber}>
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`flex items-center justify-center px-4 h-10 leading-tight border border-neutral-700 transition-colors duration-200
                  ${page === pageNumber
                    ? 'text-primary bg-neutral-700 cursor-default'
                    : 'text-gray-400 bg-dark hover:bg-neutral-800 hover:text-white'
                  }
                  rounded-full mx-2
                `}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
