import z from 'zod'

export const propiedadSchema = z.object({
  titulo: z
    .string()
    .min(5, { message: 'El título debe tener al menos 5 caracteres.' })
    .max(100, { message: 'El título no debe exceder los 100 caracteres.' }),

  descripcion: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
    .max(1000, { message: 'La descripción no debe exceder los 1000 caracteres.' }),

  categoria: z
    .string()
    .min(1, { message: 'La categoría es obligatoria.' })
    .max(55, { message: 'La categoría no debe exceder los 55 caracteres.' }),

  precio: z
    .string()
    .regex(/^\d+$/, { message: 'El precio debe ser un número positivo.' })
    .transform((val) => parseInt(val)),

  ambientes: z
    .string()
    .regex(/^\d+$/, { message: 'Los ambientes deben ser un número entero positivo.' })
    .transform((val) => parseInt(val)),

  dormitorios: z
    .string()
    .regex(/^\d+$/, { message: 'El número de dormitorios debe ser un número entero no negativo.' })
    .transform((val) => parseInt(val)),

  calle: z
    .string()
    .min(1, { message: 'La calle es obligatoria.' })
    .max(100, { message: 'La calle no debe exceder los 100 caracteres.' }),

  banos: z
    .string()
    .regex(/^\d+$/, { message: 'El número de baños debe ser un número entero no negativo.' })
    .transform((val) => parseInt(val)),

  cochera: z
    .string()
    .regex(/^\d+$/, { message: 'El número de cocheras debe ser un número entero no negativo.' })
    .transform((val) => parseInt(val)),

  metros: z
    .string()
    .regex(/^\d+$/, { message: 'Los metros cuadrados deben ser un número positivo.' })
    .transform((val) => parseInt(val)),

  lat: z
    .number()
    .refine((num) => num >= -90 && num <= 90, {
      message: 'La latitud debe ser un número entre -90 y 90.'
    }),

  lng: z
    .number()
    .refine((num) => num >= -180 && num <= 180, {
      message: 'La longitud debe ser un número entre -180 y 180.'
    })
})

// Validación completa de la propiedad
export const validatePropiedad = async (propiedad) => {
  return propiedadSchema.safeParse(propiedad)
}

// Validación parcial para actualizaciones de propiedades <----Usar al editar una propiedad
export function validatePropiedadPartial (propiedad) {
  return propiedadSchema.partial().safeParse(propiedad)
}
