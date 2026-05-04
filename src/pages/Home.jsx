import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { fetchFeaturedProperties } from "../store/slices/propertiesSlice";
import { FaRulerCombined, FaBed, FaBath, FaSearch } from "react-icons/fa";
import ImageCarousel from "../components/ImageCarousel";
import heroImg from "../assets/home.png";
import GoogleLocationInput from "../components/GoogleLocationInput";


export default function Home() {

  console.log("GOOGLE KEY:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
  const nav = useNavigate();
  const dispatch = useDispatch();
  const featured = useSelector((s) => s.properties.featured);

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [operationType, setOperationType] = useState("");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [operationTypes, setOperationTypes] = useState([]);

  useEffect(() => {
    dispatch(fetchFeaturedProperties());
  }, [dispatch]);

  useEffect(() => {
    api
      .get("/catalog/property-types")
      .then((r) => {
        console.log("property-types:", r.data);
        setPropertyTypes(r.data.data?.property_types || []);
      })
      .catch((err) => {
        console.error("Error property-types:", err);
      });

    api
      .get("/catalog/operation-types")
      .then((r) => {
        console.log("operation-types:", r.data);
        setOperationTypes(r.data.data?.operation_types || []);
      })
      .catch((err) => {
        console.error("Error operation-types:", err);
      });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    }

    if (propertyType) {
      params.set("property_type_id", propertyType);
    }

    if (operationType) {
      params.set("operation_type_id", operationType);
    }

    nav(`/comprar?${params.toString()}`);
  };

  return (
    <div className="bg-surface text-on-surface">
      {/* HERO */}
      <section className="relative min-h-[86vh] flex items-center pt-24 overflow-hidden">
        {/* Imagen + overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="hero"
            className="w-full h-full object-cover object-[center_28%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <span className="text-secondary tracking-[0.3em] text-xs uppercase mb-1 block">
              TODAS LAS OPCIONES.
            </span>
            <span className="text-secondary tracking-[0.3em] text-xs uppercase mb-5 block">
              UN SOLO LUGAR.
            </span>

            <h1 className="text-2xl md:text-4xl font-bold leading-tight text-white mb-6 max-w-2xl">
              Encontrá la propiedad que se adapta a tu vida.
            </h1>

            <p className="text-on-surface-variant text-base md:text-lg mb-10 max-w-xl">
              Comprá, alquilá o reservá tu próxima propiedad de forma simple,
              segura y personalizada.
            </p>

            {/* Buscador */}
            <div className="bg-primary/60 backdrop-blur-xl p-6 md:p-8 border border-white/10 rounded-lg shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold">
                    Ubicación
                  </label>
                  <GoogleLocationInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSelect={(place) => {
                      setSearchTerm(place.query);
                    }}
                    placeholder="Ciudad, barrio o dirección"
                    className="w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white placeholder:text-white/40 outline-none font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold">
                    Tipo de propiedad
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white outline-none cursor-pointer"
                  >
                    <option className="bg-primary" value="">
                      Todas
                    </option>
                    {propertyTypes.map((t) => (
                      <option className="bg-primary" key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold">
                    Operación
                  </label>
                  <select
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white outline-none cursor-pointer"
                  >
                    <option className="bg-primary" value="">
                      Todas
                    </option>
                    {operationTypes.map((t) => (
                      <option className="bg-primary" key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    className="w-full bg-secondary text-primary h-14 flex items-center justify-center gap-3 text-[11px] font-bold tracking-widest uppercase hover:brightness-110 transition rounded-sm"
                  >
                    <FaSearch className="text-sm" />
                    Buscar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTACADAS */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-secondary tracking-[0.2em] text-xs uppercase block mb-2">
              Catálogo
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Propiedades Destacadas
            </h2>
            <p className="text-on-surface-variant">
              Selección premium de oportunidades inmobiliarias
            </p>
          </div>

          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  to={`/propiedad/${p.id}`}
                  className="bg-primary/40 border border-white/10 rounded-xl overflow-hidden hover:border-secondary transition group"
                >
                  <div className="h-56 overflow-hidden">
                    <ImageCarousel images={p.images} alt={p.title} />
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-white mb-2 group-hover:text-secondary transition">
                      {p.title}
                    </h3>

                    <p className="text-secondary text-xl font-bold mb-2">
                      ${parseFloat(p.price).toLocaleString()} {p.currency}
                    </p>

                    <p className="text-sm text-on-surface-variant mb-4">
                      {[p.street, p.street_number, p.city]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    <div className="flex gap-4 text-xs text-white/80">
                      {p.bedrooms && (
                        <div className="flex items-center gap-1">
                          <FaBed />
                          {p.bedrooms}
                        </div>
                      )}
                      {p.bathrooms && (
                        <div className="flex items-center gap-1">
                          <FaBath />
                          {p.bathrooms}
                        </div>
                      )}
                      {p.surface_total && (
                        <div className="flex items-center gap-1">
                          <FaRulerCombined />
                          {p.surface_total} m²
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-white/10 bg-primary/20 rounded-xl">
              <p className="text-on-surface-variant">
                No hay propiedades destacadas en este momento
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
