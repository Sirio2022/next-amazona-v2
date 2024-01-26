export const round2 = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  return doc;
}

export const formatearFecha = (fecha: any) => {
  const fechaFormateada = new Date(fecha.split('T')[0].split('-'));
  const options: Intl.DateTimeFormatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
  return fechaFormateada.toLocaleDateString('en-US', options);
};

export function formatoMoneda(cantidad: any) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cantidad);
}