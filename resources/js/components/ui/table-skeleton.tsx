interface TableSkeletonProps {
    rows?: number;
    cols: number;
}

export function TableSkeleton({ rows = 6, cols }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, r) => (
                <tr key={r}>
                    {Array.from({ length: cols }).map((_, c) => (
                        <td key={c} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}
