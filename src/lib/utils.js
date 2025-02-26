export const desviacionEstandar = (data= [], calificaciones) => {
    const n = data?.length;
    const mean = data.reduce((acc, curr) => acc + curr, 0) / n;
    const variance = data.reduce((acc, curr) => acc + (curr - mean) ** 2, 0) / n;
    const desviacion = Math.sqrt(variance);
    return distribucionNormal(calificaciones, mean, desviacion);
}

export const distribucionNormal = (calificaciones, media, desviacion) => {
    const pi = Math.PI;
    if (Array.isArray(calificaciones)) {
        return calificaciones.flatMap((val) => {
            const coeficiente = 1 / (desviacion * Math.sqrt(2 * pi));
            const exponente = Math.exp(-Math.pow(val - media, 2) / (2 * Math.pow(desviacion, 2)));
            const valor = coeficiente * exponente;
            return { valor: val, promedio: isNaN(valor) ? 0 : valor  };
        });
    }
}