export function findAttractionBySlug(datas, slug) {
    for (const park of datas) {
        const attraction = park.attractions.find(
            (attraction) => String(attraction.slug) === slug
        )

        if (attraction) {
            return { park, attraction }
        }
    }

    return {
        park: undefined,
        attraction: undefined
    }
}