// src/pages/diagnostic/flow/infoContent.tsx
import React from 'react';
import type { QuestionId } from './types';

// ✅ Contenido reutilizable para Q_ENCARGADO y Q_TRAZ_ESTAND
const INFO_ENCARGADO: React.ReactNode = (
  <div className="space-y-4">
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">
        ¿Tienes un encargado de cumplimiento REP y/o VU-RETC?
      </p>
      <p className="text-sm text-gray-700">
        El encargado de cumplimiento es la persona responsable de que tu empresa cumpla con la Ley REP y con las obligaciones de la Ventanilla Única (VU) y el Registro de Emisiones y Transferencias de Contaminantes (RETC).
      </p>
    </div>

    <div>
      <p className="text-sm font-medium text-gray-800">Este rol se encarga de:</p>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex gap-2">
          <span className="min-w-fit font-medium">Declarar:</span>
          <span>los envases y embalajes puestos en el mercado.</span>
        </li>
        <li className="flex gap-2">
          <span className="min-w-fit font-medium">Mantener:</span>
          <span>actualizada la información en los sistemas oficiales.</span>
        </li>
        <li className="flex gap-2">
          <span className="min-w-fit font-medium">Coordinar:</span>
          <span>acciones internas para asegurar el cumplimiento normativo.</span>
        </li>
      </ul>
    </div>

    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
      <p className="text-sm text-blue-900">
        Si en tu empresa ya existe una persona con este rol asignado, selecciona <b>Sí</b>. Si no hay un encargado formal o estas funciones se realizan de forma informal, selecciona <b>No</b>.
      </p>
    </div>
  </div>
);

export const QUESTION_INFO: Partial<Record<QuestionId, React.ReactNode>> = {
  Q_SIZE: (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-800">
        Conocer el tamaño de tu empresa es clave para determinar tus obligaciones según la Ley REP y otras normativas ambientales.
      </p>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          A continuación, te explicamos cada categoría:
        </p>
        
        <ul className="space-y-1 text-sm">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-800 min-w-fit">Microempresa:</span>
            <span className="text-gray-600">Hasta 9 trabajadores y ventas anuales inferiores a 2.400 UF.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-800 min-w-fit">Pequeña empresa:</span>
            <span className="text-gray-600">Entre 10 y 49 trabajadores, con ventas entre 2.400 y 25.000 UF anuales.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-800 min-w-fit">Mediana empresa:</span>
            <span className="text-gray-600">Entre 50 y 199 trabajadores, y ventas entre 25.000 y 100.000 UF anuales.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-800 min-w-fit">Gran empresa:</span>
            <span className="text-gray-600">200 o más trabajadores o ventas anuales superiores a 100.000 UF.</span>
          </li>
        </ul>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-blue-800">
          <span className="font-medium">💡 Dato útil:</span> Si no tienes el dato exacto, responde según tu estimación actual. Esta información nos ayuda a entregarte recomendaciones más precisas.
        </p>
      </div>
    </div>
  ),

  Q_COMERCIALIZA: (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-800">
        Esta pregunta busca saber si tu empresa pone en el mercado chileno productos que incluyen envases o embalajes, ya sea para consumo final o como parte de su distribución.
      </p>

      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">¿Qué se entiende por envases y embalajes?</span>
        </p>

        <ul className="space-y-1 text-sm">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-800 min-w-fit">Envases primarios:</span>
            <span className="text-gray-600">
              Contienen el producto que llega al consumidor (por ejemplo, botellas, latas, cajas de cartón de alimentos).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-800 min-w-fit">Envases secundarios:</span>
            <span className="text-gray-600">
              Agrupan varios productos ya envasados (como bandejas plásticas o cajas agrupadoras de botellas).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-800 min-w-fit">Embalajes terciarios:</span>
            <span className="text-gray-600">
              Usados para transporte y almacenamiento (como palets, cajas grandes o film plástico envolvente).
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-blue-800">
          <span className="font-medium">🔑 Dato clave:</span> Si comercializas productos que generan residuos de envases o embalajes en Chile, incluso si son de tipo industrial o comercial, puedes estar afecto a la Ley REP. Esto aplica tanto para productos fabricados en Chile como importados.
        </p>
      </div>
    </div>
  ),

  Q_KG300: (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">
        Este dato es clave: si superas los <b>300 kg anuales</b>, quedas afecto a la Ley REP y debes declarar tu volumen de envases y embalajes.
      </p>

      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">¿Qué se entiende por “poner en el mercado”?</span>
        </p>
        <p className="text-sm text-gray-600">
          Significa vender, importar o distribuir productos cuyos envases se convierten en residuos dentro de Chile (plásticos, cartones, vidrios, metales, etc.).
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">¿Cómo dimensionar 300 kg? Ejemplos aproximados:</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">Botellas plásticas (1 L):</span>
            <span>
              1 botella pesa aprox. <b>30–35 g</b>.
              <br className="hidden sm:block" />
              <span className="block sm:inline">➜ 300 kg ≈ <b>8.500–10.000</b> botellas/año.</span>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">Cajas de cartón corrugado:</span>
            <span>
              Una caja estándar (35×25×15 cm) pesa aprox. <b>300 g</b>.
              <br className="hidden sm:block" />
              <span className="block sm:inline">➜ 300 kg ≈ <b>1.000</b> cajas/año.</span>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">Stretch film (para pallets):</span>
            <span>
              Un rollo pesa aprox. <b>2–2,5 kg</b>.
              <br className="hidden sm:block" />
              <span className="block sm:inline">➜ 300 kg ≈ <b>120–150</b> rollos/año.</span>
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-900">
          <span className="font-medium">Importante:</span> Si no sabes el dato exacto, puedes marcar <b>“No lo sé”</b>. Más adelante en el test te daremos herramientas para estimarlo mejor. 
          Si ya manejas grandes volúmenes de venta o logística, es muy probable que superes los <b>300 kg</b>.
        </p>
      </div>
    </div>
  ),

  Q_MEDICION_TODO: (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">Ingreso manual de productos</p>
        <p className="text-sm text-gray-700">
          Aquí podrás ingresar tus productos uno a uno, con la información clave para calcular su contribución en envases y embalajes.
          Este paso nos permite asociar correctamente cada producto con su comportamiento en el mercado y su impacto según la Ley REP.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Completa los siguientes campos:</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">Nombre del producto:</span>
            <span>Identifica el producto tal como lo comercializas (ej. “Botella de jugo 1&nbsp;L”).</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">Familia de producto:</span>
            <span>Clasifica el producto dentro de una categoría general (ej. bebidas, cosméticos, alimentos, etc.).</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">Tipo de producto:</span>
            <span>Define si es un producto terminado, un componente, materia prima, etc.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">¿Es retornable?</span>
            <span>Indica si el envase o embalaje del producto es reutilizable o si se convierte en residuo tras su uso.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-medium">Ventas anuales:</span>
            <span>Número total de unidades de este producto vendidas en el mercado chileno durante el último año.</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-blue-900">
          Esta información nos ayudará a estimar con precisión el volumen total de envases que pones en el mercado.
          <br />
          <span className="font-medium">Recuerda:</span> podrás editar o agregar productos en cualquier momento desde tu biblioteca.
        </p>
      </div>
    </div>
  ),

  Q_TRAZ_ESTAND: (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          ¿Con qué nivel de estandarización se representa tu empresa?
        </p>
        <p className="text-sm text-gray-700">
          La estandarización de la información en tu organización influye directamente en la rapidez y precisión con la que podemos calcular y gestionar tus datos de envases y embalajes.
        </p>
        <p className="text-sm text-gray-700">
          A continuación, los niveles para que identifiques el que más se ajusta a tu realidad:
        </p>
      </div>

      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex gap-2">
          <span className="min-w-fit font-semibold text-gray-800">Óptimo:</span>
          <span>Cuentas con datos completos en un sistema PLM/ERP, estructuras de producto bien definidas y componentes documentados.</span>
        </li>
        <li className="flex gap-2">
          <span className="min-w-fit font-semibold text-gray-800">Bueno:</span>
          <span>Tu ERP contiene la mayoría de los datos, aunque con algunas inconsistencias que requieren validación.</span>
        </li>
        <li className="flex gap-2">
          <span className="min-w-fit font-semibold text-gray-800">Regular:</span>
          <span>La información está fragmentada entre distintos sistemas, hojas de cálculo y documentos, sin una estructura central clara.</span>
        </li>
        <li className="flex gap-2">
          <span className="min-w-fit font-semibold text-gray-800">Limitado:</span>
          <span>No tienes sistemas formales; los datos están dispersos y gran parte del conocimiento reside en las personas del equipo.</span>
        </li>
        <li className="flex gap-2">
          <span className="min-w-fit font-semibold text-gray-800">Crítico:</span>
          <span>No existen datos estructurados; es necesario un levantamiento completo desde cero para iniciar la gestión.</span>
        </li>
      </ul>

      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-blue-900">
          <span className="font-medium">Sugerencia:</span> Selecciona la opción que más se acerque a tu situación actual, incluso si no es perfecta. Esto nos permitirá adaptar el proceso a tus necesidades reales.
        </p>
      </div>
    </div>
  ),


  Q_TRAZ_FAMILIAS: (
  <div className="space-y-4">
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">
        ¿Qué nivel de complejidad tiene tu portafolio de productos?
      </p>
      <p className="text-sm text-gray-700">
        Esta pregunta nos ayuda a entender qué tan grande y variado es tu catálogo, para ajustar el proyecto y el software a tus necesidades.
        Para eso, analizamos seis aspectos clave que te iremos preguntando:
      </p>
    </div>

    <ul className="space-y-2 text-sm text-gray-700">
      <li className="flex gap-2">
        <span className="min-w-fit font-semibold text-gray-800">Familias de producto:</span>
        <span>
          Es el grupo más amplio al que pertenecen tus productos. Por ejemplo, si vendes muebles, tus familias pueden ser “Sillas”, “Mesones” y “Armarios”.
          Si manejas 3 familias, respondes 3.
        </span>
      </li>
      <li className="flex gap-2">
        <span className="min-w-fit font-semibold text-gray-800">Líneas o subfamilias por familia:</span>
        <span>
          Dentro de cada familia hay grupos más específicos. Por ejemplo, dentro de “Sillas” puedes tener “Sillas de oficina”, “Sillas escolares” y “Sillas gamer”.
          Si en promedio cada familia tiene 3 líneas, pones 3.
        </span>
      </li>
      <li className="flex gap-2">
        <span className="min-w-fit font-semibold text-gray-800">Categorías por línea o marca:</span>
        <span>
          Son divisiones aún más detalladas, como “Sillas con ruedas”, “Sillas fijas”, “Sillas tapizadas”.
          Si dentro de una línea tienes en promedio 5 categorías, colocas 5.
        </span>
      </li>
      <li className="flex gap-2">
        <span className="min-w-fit font-semibold text-gray-800">SKUs activos por categoría:</span>
        <span>
          Un SKU es una unidad específica que vendes, que incluye variantes. Por ejemplo, una “Silla tapizada” SKU puede venir en colores rojo, azul y negro,
          y en tallas pequeñas y grandes. Si tienes 6 variantes activas en promedio, pones 6.
        </span>
      </li>
      <li className="flex gap-2">
        <span className="min-w-fit font-semibold text-gray-800">Niveles de estructura en tu portafolio:</span>
        <span>
          Es la cantidad total de niveles que tienes desde la familia hasta el SKU. En el ejemplo: familia → línea → categoría → SKU,
          serían 4 niveles. Si tienes más o menos, indícalo.
        </span>
      </li>
      <li className="flex gap-2">
        <span className="min-w-fit font-semibold text-gray-800">Componentes por SKU:</span>
        <span>
          Son las partes que componen un producto. Por ejemplo, una silla puede tener componentes como asiento, respaldo, ruedas y brazos.
          Si en promedio cada SKU tiene 4 componentes, pones 4.
        </span>
      </li>
    </ul>

    <div className="space-y-1 text-sm text-gray-700">
      <p><b>Piensa en tu portafolio como un árbol:</b></p>
      <p>La raíz son las familias.</p>
      <p>Las ramas son las líneas y categorías.</p>
      <p>Las hojas son los SKUs y sus componentes.</p>
      <p>Mientras más ramas y hojas tenga el árbol, más complejo es gestionar y mapear tu catálogo.</p>
    </div>

    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
      <p className="text-sm text-blue-900">
        Si no tienes datos exactos, usa una estimación razonable. Nuestro sistema usará esos números para sugerir si es mejor hacer un análisis por muestreo,
        fases de implementación o activar funciones avanzadas del software.
      </p>
    </div>
  </div>
),


  Q_SG_ADHERIDO: (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          ¿Estás adherido a un Sistema de Gestión REP?
        </p>
        <p className="text-sm text-gray-700">
          Un <b>Sistema de Gestión REP</b> es una organización autorizada que, en nombre de las empresas productoras, se encarga de cumplir con las obligaciones de la Ley 20.920.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Existen tres tipos:</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold text-gray-800">Sistema Individual:</span>
            <span>Una sola empresa gestiona sus propios productos.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold text-gray-800">Sistema Colectivo:</span>
            <span>Menos de 20 empresas se agrupan para cumplir juntas.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold text-gray-800">Gran Sistema de Gestión Colectivo:</span>
            <span>Más de 20 empresas se agrupan para cumplir juntas.</span>
          </li>
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">¿Por qué adherirse?</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">Recolectar y valorizar:</span>
            <span>tus productos al final de su vida útil.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">Cumplir metas oficiales:</span>
            <span>de recolección establecidas por el Ministerio del Medio Ambiente.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">Coordinar logística:</span>
            <span>contratar gestores de residuos y ejecutar campañas de educación ambiental.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">Presentar reportes:</span>
            <span>e informes y declaraciones oficiales ante la autoridad.</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-blue-900">
          Así, tu empresa puede enfocarse en su negocio mientras asegura el cumplimiento legal y contribuye a la economía circular.
        </p>
      </div>
    </div>
  ),


  Q_SG_DECLARADO: (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          ¿Has realizado declaraciones en la Ventanilla Única (VU–RETC)?
        </p>
        <p className="text-sm text-gray-700">
          Las declaraciones en el Sistema de Gestión REP son reportes oficiales que las empresas deben presentar al Ministerio del Medio Ambiente para informar sobre los productos prioritarios que ponen en el mercado chileno (p. ej.: envases y embalajes, neumáticos, baterías, aceites, aparatos eléctricos y electrónicos).
        </p>
        <p className="text-sm text-gray-700">
          En ellas se detalla la <b>cantidad</b>, <b>peso</b>, <b>tipo de material</b> y si se cumplen las <b>metas de recolección y valorización</b> establecidas en la Ley 20.920.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Existen dos tipos principales:</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">Declaración Jurada Anual:</span>
            <span>resume todos los productos puestos en el mercado durante el año anterior.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">Declaraciones Mensuales:</span>
            <span>informan mensualmente las toneladas de residuos de productos prioritarios.</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-900">
          <b>Importante:</b> No presentar estas declaraciones, hacerlo fuera de plazo o entregar información falsa puede generar <b>multas elevadas</b> y <b>sanciones administrativas</b>.
        </p>
      </div>
    </div>
  ),

  Q_VU_REG: (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          ¿Estás registrado en la Ventanilla Única (VU–RETC)?
        </p>
        <p className="text-sm text-gray-700">
          La Ventanilla Única RETC es una plataforma digital del Ministerio del Medio Ambiente de Chile que centraliza en un solo lugar todas las declaraciones ambientales que las empresas deben realizar.
        </p>
        <p className="text-sm text-gray-700">
          Esta herramienta integra el <b>Registro de Emisiones y Transferencia de Contaminantes (RETC)</b> y permite reportar, desde un único portal, las emisiones al aire, agua y suelo, así como las transferencias de residuos.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Obligatoriedad</p>
        <p className="text-sm text-gray-700">
          Registrarse en la Ventanilla Única es obligatorio para establecimientos industriales que deban reportar información ambiental según normativas como el <b>DS 138/2005</b> (fuentes fijas), el <b>DS 1/2013</b> (RETC) y otras regulaciones sectoriales.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">¿Qué ganas al registrarte?</p>
        <p className="text-sm text-gray-700">
          Obtienes un <b>usuario único</b> que te permite cumplir con todas tus obligaciones de reporte ambiental —incluyendo las declaraciones REP— de forma simplificada y con <b>trazabilidad digital</b> completa.
        </p>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-900">
          <b>Importante:</b> No contar con este registro implica que no podrás realizar tus declaraciones ambientales ni cumplir con la trazabilidad y simplificación que exige la normativa, lo que puede generar incumplimientos.
        </p>
      </div>
    </div>
  ),

  Q_VU_APERTURA: (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          ¿Has aperturado sectoriales?
        </p>
        <p className="text-sm text-gray-700">
          Los <b>Sectoriales RETC</b> son formularios específicos para cada sector productivo que debes completar dentro de la Ventanilla Única RETC según la actividad de tu establecimiento. Cada sectorial solicita información ambiental particular de industrias como minería, energía, agricultura, manufactura, entre otras.
        </p>
        <p className="text-sm text-gray-700">
          <b>Aperturar sectoriales</b> significa habilitar en tu cuenta los formularios correspondientes a tu rubro para reportar datos como <i>emisiones atmosféricas</i>, <i>descargas de aguas residuales</i>, <i>generación de residuos peligrosos y no peligrosos</i> y <i>uso de sustancias químicas</i>.
        </p>
        <p className="text-sm text-gray-700">
          Seleccionar correctamente los sectoriales aplicables a tu operación es fundamental, ya que esto determina qué información deberás declarar anualmente según la normativa ambiental chilena.
        </p>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-900">
          <b>Importante:</b> No aperturar los sectoriales implica que no tendrás habilitados los formularios obligatorios para reportar tu información ambiental, lo que puede derivar en incumplimientos normativos.
        </p>
      </div>
    </div>
  ),

  Q_VU_DECL: (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-800">
          ¿Has realizado declaraciones en Ventanilla Única RETC?
        </p>
        <p className="text-sm text-gray-700">
          Las <b>Declaraciones RETC</b> son reportes ambientales obligatorios que las empresas deben presentar una vez al año a través de la Ventanilla Única del Registro de Emisiones y Transferencia de Contaminantes (RETC).
        </p>
        <p className="text-sm text-gray-700">
          Estos reportes permiten registrar y transparentar información sobre:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Emisiones contaminantes al aire, agua y suelo.</li>
          <li>Manejo y disposición de residuos.</li>
          <li>Uso de recursos naturales por parte de tu establecimiento.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Formularios sectoriales frecuentes:</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">D.S. N°138/2005:</span>
            <span>Fuentes fijas de emisión.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">SIDREP:</span>
            <span>Reporte de residuos peligrosos.</span>
          </li>
          <li className="flex gap-2">
            <span className="min-w-fit font-semibold">SINADER:</span>
            <span>Reporte de residuos no peligrosos.</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-blue-900">
          El plazo para presentar estas declaraciones generalmente finaliza el <b>30 de septiembre</b> de cada año.
        </p>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
        <p className="text-sm text-yellow-900">
          <b>Importante:</b> No realizar las declaraciones puede derivar en sanciones por parte de la Superintendencia del Medio Ambiente, incluyendo <b>multas económicas</b> cuya gravedad depende del nivel de incumplimiento.
        </p>
      </div>
    </div>
  ),






  // ✅ Reutilizamos la misma info para ambos IDs
  Q_ENCARGADO: INFO_ENCARGADO,
  Q_TRAZ_ENCARGADO: INFO_ENCARGADO,
};

// Función helper para obtener el contenido
export function getQuestionInfo(questionId: QuestionId): React.ReactNode | null {
  return QUESTION_INFO[questionId] || null;
}
