export const functions = {
    formatToCurrency: ( number: number ) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            useGrouping: true
        }).format(number);
    }
}