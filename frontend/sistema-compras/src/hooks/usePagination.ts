import { useState, useCallback } from "react"

const PAGE_SIZE = 20

export function usePagination() {
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const skip = (currentPage - 1) * PAGE_SIZE

  const reset = useCallback(() => setCurrentPage(1), [])

  return {
    currentPage,
    totalPages,
    total,
    skip,
    limit: PAGE_SIZE,
    setTotal,
    setCurrentPage,
    reset,
  }
}