

export const Buscador = () => {
    return (
        <div className="flex justify-center lg:justify-end w-full lg:w-10/12 mx-auto">
            <div className="flex w-fit border border-blue-400 rounded-sm rigth p-1">
                <label htmlFor="buscador" className="cursor-pointer">
                    <img src="https://cdn.icon-icons.com/icons2/3468/PNG/128/web_ui_interface_magnifying_glass_magnifier_find_search_icon_219794.png" alt="Icono buscador" className="w-10 h-10" />
                </label>

                <input type="text" id="buscador" className="text-lg p-2 outline-none" />
            </div>
        </div>
    )
}
