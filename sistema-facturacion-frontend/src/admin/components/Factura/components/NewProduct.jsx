

export const NewProduct = () => {
    return (
        <section className="flex flex-col sm:flex-row items-center sm:items-end sm:justify-between my-20 p-5">

            <div className="sm:flex sm:flex-col sm:gap-y-2">
                <div className="text-center">
                    <label
                        htmlFor="iva"
                        className="text-xl text-blue-500 font-semibold"
                    >
                        ¿Esta factura tiene IVA?
                    </label>

                    <p
                        className="text-mdtext-gray-500 font-medium m-0 p-0"
                    >
                        En caso de no tener, poner 0
                    </p>

                </div>

                <input
                    type="number"
                    min={0}
                    placeholder="ej: 19"
                    className="border-2 border-blue-400 rounded p-1"
                />

            </div>

            <div className="mt-5 sm:mt-0">
                <button
                    className="text-lg text-blue-600 font-medium hover:text-white hover:bg-blue-500 border border-blue-500 rounded p-2"
                >
                    Nuevo Producto
                </button>
            </div>

        </section>
    )
}
