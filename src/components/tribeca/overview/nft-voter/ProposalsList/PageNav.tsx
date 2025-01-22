'use client'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface Props {
    numPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
}

export function PageNav({ currentPage, setCurrentPage, numPages }: Props) {
    return (
        <div className="flex items-center justify-between px-7 py-3">
            <div className="w-20">
                {currentPage !== 0 ? (
                    <button 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="flex gap-2 relative justify-center items-center hover:text-saber-300 uppercase"
                    >
                        <FaChevronLeft />
                        Prev
                    </button>
                ) : (
                    <div />
                )}
            </div>
            
            <nav aria-label="Page navigation" className="flex-grow">
                <ul className="w-full justify-center flex gap-4 items-center">
                    {Array.from({ length: numPages }).map((_, i) => (
                        <li key={i}>
                            <button
                                className={`transition-colors ${
                                    currentPage === i ? 'text-saber' : ''
                                }`}
                                onClick={() => setCurrentPage(i)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="w-20 text-right">
                {currentPage !== numPages - 1 ? (
                    <button 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="flex gap-2 relative justify-center items-center hover:text-saber-300 uppercase"
                    >
                        Next
                        <FaChevronRight />
                    </button>
                ) : (
                    <div />
                )}
            </div>
        </div>
    )
}