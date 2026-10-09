
export const getAttractionCategory = (type) => {

    if (!type) return 'Autres'

    const normalizedType = type.toLowerCase()

    if (
        normalizedType.includes('montagne russe') ||
        normalizedType.includes('montagnes russes') ||
        normalizedType.includes('coaster') ||
        normalizedType.includes('hypercoaster')
    ) {
        return 'Montagnes russes'
    }

    if (
        normalizedType.includes('tour de chute') ||
        normalizedType.includes('drop')
    ) {
        return 'Attractions à sensations'
    }

    if (
        normalizedType.includes('aquatique') ||
        normalizedType.includes('water')
    ) {
        return 'Attractions aquatiques'
    }

    if (
        normalizedType.includes('dark ride') ||
        normalizedType.includes('intérieur')
    ) {
        return 'Attractions intérieures'
    }

    return 'Attractions familiales'
}
