// Wiki Técnica - Shared JavaScript File
// Injects responsive glassmorphic navbar, themes, copy buttons, global search and exam questions.

//// 1. Exam Questions Database (MP0484 - Evaluaciones de Desarrollo Oficiales)
const examQuestions = {
  "design.html": [
    {
      q: "NF1 - Enunciado Práctico E/R: Un servicio de streaming necesita registrar sus 'Películas' (código, título, año) y 'Usuarios' (dni, nombre, email). Un usuario puede alquilar muchas películas y una película puede ser alquilada por muchos usuarios; cada alquiler debe registrar obligatoriamente la fecha del alquiler y el precio cobrado. Identifica las entidades, atributos, claves primarias y relaciones con sus cardinalidades.",
      a: "<strong>1. Entidades y Atributos:</strong><br>- <strong>Peliculas:</strong> <u>codigo</u> (PK), titulo, año.<br>- <strong>Usuarios:</strong> <u>dni</u> (PK), nombre, email.<br><br><strong>2. Relación y Cardinalidades:</strong><br>- Relación N:M <strong>'Alquilar'</strong> entre Usuarios (0,N) y Peliculas (0,N).<br><br><strong>3. Atributos Propios de la Relación:</strong><br>- fecha_alquiler, precio_cobrado (no definen a la película ni al usuario por separado, sino a la combinación única de ambos)."
    },
    {
      q: "NF1 - Conversión a Modelo Lógico: Convierte el modelo conceptual anterior (Películas, Usuarios y la relación N:M de alquiler) al esquema relacional de base de datos indicando de forma explícita las claves primarias (PK) y foráneas (FK).",
      a: "El diseño lógico resultante se compone de 3 tablas operativas:<br><br>1. <strong>peliculas</strong> (<u>codigo</u> [PK], titulo, año)<br>2. <strong>usuarios</strong> (<u>dni</u> [PK], nombre, email)<br>3. <strong>alquileres</strong> (<u>dni_usuario</u> [PK][FK], <u>codigo_pelicula</u> [PK][FK], <u>fecha_alquiler</u> [PK], precio_cobrado)<br><br><em>Nota de Examen:</em> La relación N:M se descompone en una tabla intermedia. Su clave primaria (PK) es una clave compuesta por las claves de las tablas originales y la fecha para permitir que un mismo usuario alquile la misma película en fechas distintas. Ambas columnas actúan como claves foráneas (FK) referenciando a sus respectivas tablas maestras."
    },
    {
      q: "NF1 - Caso de Normalización: Dada la tabla desnormalizada <code>PEDIDOS(id_pedido [PK], fecha, cliente_dni, cliente_nombre, articulo_cod, articulo_precio)</code>, realiza la normalización paso a paso desde 1FN hasta 3FN justificando cada separación.",
      a: "<strong>1. Primera Forma Normal (1FN):</strong> Todos los valores deben ser atómicos. La tabla ya cumple la 1FN (suponiendo que no hay listas de artículos por celda).<br><br><strong>2. Segunda Forma Normal (2FN):</strong> Estando en 1FN, todo atributo no clave debe depender de forma completa de la clave primaria. Como la PK es simple (<code>id_pedido</code>), no hay dependencias parciales de claves compuestas. La tabla ya está en 2FN.<br><br><strong>3. Tercera Forma Normal (3FN) - Dependencias Transitivas:</strong> Estando en 2FN, ningún atributo no clave debe depender de otro atributo no clave. Identificamos dos dependencias transitivas claras:<br>1. <code>cliente_nombre</code> depende de <code>cliente_dni</code>, el cual depende de <code>id_pedido</code>.<br>2. <code>articulo_precio</code> depende de <code>articulo_cod</code>, el cual depende de <code>id_pedido</code>.<br><br><strong>Resolución final (Separación en 3 tablas limpias):</strong><br>- <strong>CLIENTES</strong> (<u>cliente_dni</u> [PK], cliente_nombre)<br>- <strong>ARTICULOS</strong> (<u>articulo_cod</u> [PK], articulo_precio)<br>- <strong>PEDIDOS</strong> (<u>id_pedido</u> [PK], fecha, cliente_dni [FK], articulo_cod [FK])"
    }
  ],
  "sql.html": [
    {
      q: "NF2 - DDL Avanzado con Restricciones: Escribe el comando <code>CREATE TABLE</code> para la tabla intermedia <code>alquileres</code> generada en el bloque NF1. Exige que el precio cobrado sea mayor a 0 con un <code>CONSTRAINT CHECK</code> y aplica reglas de propagación: <code>ON UPDATE CASCADE ON DELETE RESTRICT</code>.",
      a: "<code><pre>CREATE TABLE alquileres (\n    dni_usuario VARCHAR(9),\n    codigo_pelicula INT,\n    fecha_alquiler DATE,\n    precio_cobrado DECIMAL(5,2) NOT NULL,\n    \n    -- Restricción PK Compuesta\n    CONSTRAINT pk_alquileres PRIMARY KEY (dni_usuario, codigo_pelicula, fecha_alquiler),\n    \n    -- Validar que el precio cobrado sea positivo\n    CONSTRAINT chk_precio_positivo CHECK (precio_cobrado > 0),\n    \n    -- Reglas de integridad referencial\n    CONSTRAINT fk_alquiler_usuario FOREIGN KEY (dni_usuario)\n        REFERENCES usuarios(dni)\n        ON UPDATE CASCADE\n        ON DELETE RESTRICT, -- Impide borrar usuario con alquileres activos\n        \n    CONSTRAINT fk_alquiler_pelicula FOREIGN KEY (codigo_pelicula)\n        REFERENCES peliculas(codigo)\n        ON UPDATE CASCADE\n        ON DELETE RESTRICT\n);</pre></code>"
    },
    {
      q: "NF2 - Ejercicio DML de Examen (Agregación y JOINs): Escribe una consulta SQL que devuelva el nombre del usuario, el total de alquileres realizados (alias 'total_alquileres') y la suma recaudada (alias 'total_gastado'), agrupando por usuario, pero únicamente para aquellos que hayan gastado más de 50€ en total.",
      a: "<code><pre>SELECT u.nombre,\n       COUNT(a.codigo_pelicula) AS total_alquileres,\n       SUM(a.precio_cobrado) AS total_gastado\nFROM usuarios u\nINNER JOIN alquileres a ON u.dni = a.dni_usuario\nGROUP BY u.nombre\nHAVING SUM(a.precio_cobrado) > 50\nORDER BY total_gastado DESC;</pre></code><br><em>Nota de Examen:</em> Se utiliza <code>INNER JOIN</code> para cruzar las tablas, <code>GROUP BY</code> por la columna no agregada (nombre) y la cláusula <code>HAVING</code> para filtrar basándose en una función de agregación (SUM), lo cual no se puede hacer en el WHERE."
    },
    {
      q: "NF2 - Operaciones de manipulación de datos (UPDATE con JOIN): Escribe una sentencia SQL para actualizar (incrementar en un 10%) el precio de alquiler en la tabla intermedia <code>alquileres</code> únicamente para las películas estrenadas antes del año 2000.",
      a: "<strong>En T-SQL (SQL Server / PostgreSQL):</strong><code><pre>UPDATE a\nSET a.precio_cobrado = a.precio_cobrado * 1.10\nFROM alquileres a\nINNER JOIN peliculas p ON a.codigo_pelicula = p.codigo\nWHERE p.año < 2000;</pre></code><br><strong>En MySQL:</strong><code><pre>UPDATE alquileres a\nINNER JOIN peliculas p ON a.codigo_pelicula = p.codigo\nSET a.precio_cobrado = a.precio_cobrado * 1.10\nWHERE p.año < 2000;</pre></code>"
    }
  ],
  "mysql.html": [
    {
      q: "NF2 - Procedimientos Almacenados en MySQL: Escribe la sintaxis para crear un procedimiento que reciba una clave de usuario y devuelva sus alquileres activos, explicando el cambio de DELIMITER.",
      a: "<code><pre>DELIMITER //\nCREATE PROCEDURE sp_ObtenerAlquileresUsuario(IN p_dni VARCHAR(9))\nBEGIN\n    SELECT * FROM alquileres WHERE dni_usuario = p_dni;\nEND //\nDELIMITER ;</pre></code><br><em>Explicación técnica:</em> Cambiar el <code>DELIMITER</code> a '//' evita que el cliente SQL de MySQL interprete los caracteres ';' internos de las instrucciones SQL del cuerpo del procedimiento como el cierre del comando de creación, enviando todo el bloque como una sola instrucción atómica."
    },
    {
      q: "NF2 - Tipos de Fecha DATETIME vs TIMESTAMP en MySQL: Explica las diferencias arquitectónicas clave y el impacto en los husos horarios.",
      a: "- **DATETIME:** Almacena el valor exacto de la fecha y hora sin modificarlo (es inmune a husos horarios, rango de año 1000 a 9999).<br>- **TIMESTAMP:** Almacena el valor en formato Epoch UTC (rango limitado de 1970 a 2038). Al realizar una consulta, adapta automáticamente el huso horario al huso de la sesión activa del cliente, siendo ideal para aplicaciones distribuidas globalmente."
    }
  ],
  "mssql.html": [
    {
      q: "NF3 - Creación de Función Escalar UDF en T-SQL: Escribe una función escalar llamada <code>fn_CalcularRecargoAlquiler</code> que reciba un precio base (DECIMAL) y un porcentaje de recargo (INT), declare variables internas, calcule el precio final con recargo y lo devuelva.",
      a: "<code><pre>CREATE FUNCTION fn_CalcularRecargoAlquiler (\n    @precioBase DECIMAL(5,2),\n    @porcentajeRecargo INT\n)\nRETURNS DECIMAL(5,2)\nAS\nBEGIN\n    -- Declaración de variable de salida\n    DECLARE @precioFinal DECIMAL(5,2);\n    \n    -- Asignación de valor con SET\n    SET @precioFinal = @precioBase + (@precioBase * @porcentajeRecargo / 100.0);\n    \n    RETURN @precioFinal;\nEND;</pre></code>"
    },
    {
      q: "NF3 - Procedimiento Almacenado T-SQL con IF/ELSE y PRINT: Crea un procedimiento llamado <code>sp_RegistrarAlquiler</code> que reciba el DNI, código de película y precio. Debe validar mediante un <code>IF/ELSE</code> si el DNI existe en la tabla de usuarios. Si no existe, debe emitir un mensaje de error usando <code>PRINT</code> y no realizar la inserción; de lo contrario, realiza el INSERT.",
      a: "<code><pre>CREATE OR ALTER PROCEDURE sp_RegistrarAlquiler (\n    @dni_usuario VARCHAR(9),\n    @codigo_pelicula INT,\n    @precio DECIMAL(5,2)\n)\nAS\nBEGIN\n    SET NOCOUNT ON;\n    \n    -- Validación de existencia del usuario\n    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE dni = @dni_usuario)\n    BEGIN\n        PRINT 'ERROR: El usuario con DNI ' + @dni_usuario + ' no existe en el sistema.';\n        RETURN; -- Detiene la ejecución del procedimiento\n    END\n    ELSE\n    BEGIN\n        INSERT INTO alquileres (dni_usuario, codigo_pelicula, fecha_alquiler, precio_cobrado)\n        VALUES (@dni_usuario, @codigo_pelicula, GETDATE(), @precio);\n        \n        PRINT 'Alquiler registrado con éxito para el usuario DNI: ' + @dni_usuario;\n    END\nEND;</pre></code>"
    },
    {
      q: "NF3 - Trigger AFTER DELETE usando Tabla Virtual DELETED: Crea un trigger llamado <code>trg_ActualizarRecuentoAlquileres</code> sobre la tabla <code>alquileres</code> que, tras eliminar un alquiler, reste automáticamente el precio del alquiler eliminado de una tabla resumen llamada <code>estadisticas_usuarios(dni_usuario, total_gastado)</code> utilizando la tabla virtual <code>deleted</code>.",
      a: "<code><pre>CREATE TRIGGER trg_ActualizarRecuentoAlquileres\nON alquileres\nAFTER DELETE\nAS\nBEGIN\n    SET NOCOUNT ON;\n    \n    -- Actualiza el total gastado restando el precio del alquiler eliminado\n    UPDATE est\n    SET est.total_gastado = est.total_gastado - del.precio_cobrado\n    FROM estadisticas_usuarios est\n    INNER JOIN deleted del ON est.dni_usuario = del.dni_usuario;\n    \n    PRINT 'Recuento de gastos actualizado automáticamente en estadísticas.';\nEND;</pre></code>"
    }
  ],
  "mongodb.html": [
    {
      q: "NF4 - Seguridad y DCL en SQL: Escribe las sentencias SQL estándar/T-SQL para crear un rol llamado <code>rol_gestor_wiki</code>, agregar al usuario <code>empleado_ventas</code> como miembro de dicho rol, concederle permisos de lectura (SELECT) en la tabla <code>alquileres</code>, y denegarle explícitamente la inserción y eliminación (INSERT, DELETE).",
      a: "<code><pre>-- 1. Crear el Rol\nCREATE ROLE rol_gestor_wiki;\n\n-- 2. Agregar miembro al rol (Sintaxis T-SQL / SQL Server)\nALTER ROLE rol_gestor_wiki ADD MEMBER empleado_ventas;\n\n-- 3. Conceder lectura (SELECT)\nGRANT SELECT ON alquileres TO rol_gestor_wiki;\n\n-- 4. Denegar explícitamente inserción y borrado (Prevalece sobre cualquier GRANT)\nDENY INSERT, DELETE ON alquileres TO rol_gestor_wiki;</pre></code>"
    },
    {
      q: "NF4 - Fundamentos de Bases de Datos NoSQL: ¿En qué casos priorizar NoSQL frente a una base de datos relacional? Explica el concepto de 'Consistencia Eventual' (BASE) y detalla la diferencia arquitectónica básica entre MongoDB y Cassandra.",
      a: "<strong>1. ¿Cuándo priorizar NoSQL?:</strong><br>- Cuando se manejan grandes volúmenes de datos no estructurados o semiestructurados (esquemas dinámicos).<br>- Cuando se requiere escalabilidad horizontal masiva (sharding) sin la sobrecarga de integridad referencial de los JOINs relacionales.<br><br><strong>2. Consistencia Eventual:</strong><br>Es un principio del modelo BASE donde se admite que, tras una escritura, diferentes nodos del clúster pueden no reflejar el cambio de inmediato (Soft State), pero se garantiza que se propagará a todas las réplicas eventualmente si no se realizan nuevos cambios, priorizando la disponibilidad (Teorema CAP).<br><br><strong>3. MongoDB vs Cassandra (Diferencia arquitectónica):</strong><br>- **MongoDB:** Base de datos documental. Organiza los datos en colecciones de documentos tipo BSON (JSON binario). Excelente para esquemas flexibles, consultas jerárquicas complejas y acceso rápido por documento.<br>- **Cassandra:** Base de datos orientada a familias de columnas distribuidas de forma descentralizada (arquitectura Masterless P2P). Excelente para escrituras masivas concurrentes y alta disponibilidad en múltiples regiones geográficas."
    },
    {
      q: "NF4 - Consulta Práctica en MongoDB (find con Proyecciones): Escribe una consulta en MongoDB sobre la colección <code>alquileres</code> que filtre aquellos registros con un <code>precio_cobrado</code> superior a 15, y utilice proyecciones para ocultar el atributo interno <code>_id</code> y el <code>dni_usuario</code> de la respuesta.",
      a: "<code><pre>db.alquileres.find(\n    // 1. Criterio de filtro (Filtra precio > 15)\n    { precio_cobrado: { $gt: 15 } },\n    \n    // 2. Proyección de campos (0 para excluir de la salida)\n    {\n        _id: 0,\n        dni_usuario: 0\n    }\n);</pre></code>"
    }
  ],
  "dtd.html": [
    {
      q: "NF4 - Tipos de Datos DTD (#PCDATA vs CDATA): ¿Cuál es la diferencia entre #PCDATA y CDATA en la definición de un DTD?",
      a: "- **#PCDATA (Parsed Character Data):** Indica que el procesador XML analizará el texto buscando etiquetas o entidades internas que deba expandir (se usa únicamente en elementos).<br>- **CDATA (Character Data):** Indica texto plano puro que el procesador XML ignora a nivel estructural (se usa únicamente en atributos)."
    },
    {
      q: "NF4 - Entidades en DTD: ¿Qué es una Entidad de Parámetro y cómo se utiliza dentro de un DTD?",
      a: "Es un macro declarativo definido con un porcentaje (<code>% nombre 'valor'</code>) que sirve exclusivamente para reutilizar fragmentos de código estructural (declaraciones de elementos o atributos) dentro del propio archivo del DTD, a diferencia de las entidades generales que se expanden en el XML."
    }
  ],
  "xsd.html": [
    {
      q: "NF4 - Tipos Simples vs Complejos en XSD: Explica la diferencia teórica fundamental.",
      a: "- **Simple Type:** Solo puede contener datos elementales (texto o números) y es incapaz de albergar subelementos (hijos) ni atributos.<br>- **Complex Type:** Puede agrupar múltiples subelementos estructurados mediante secuencias, elecciones o todos (sequence, choice, all) y declarar atributos en su interior."
    },
    {
      q: "NF4 - Restricciones (Facets) en XSD: ¿Qué son los facets y cómo se implementan?",
      a: "Son delimitadores aplicados a tipos de datos simples para restringir su dominio. Se aplican dentro de un bloque <code>xs:restriction</code>. Ejemplos comunes: <code>xs:minInclusive</code> (rango inferior), <code>xs:pattern</code> (expresiones regulares) y <code>xs:enumeration</code> (valores permitidos)."
    }
  ]
};

// 2. Global Search Index (With precise hash anchors)
const searchIndex = [
  { title: "Diseño & Normalización (Inicio)", text: "formas normales 1fn 2fn 3fn conceptual logico n:m sacar artilugios episodios", url: "design.html" },
  { title: "1FN (Atomicidad)", text: "primera forma normal 1fn atomicidad valores indivisibles clave primaria compuesta", url: "design.html#1fn" },
  { title: "2FN (Dependencia Completa)", text: "segunda forma normal 2fn dependencias parciales clave compuesta episodios artilugios", url: "design.html#2fn" },
  { title: "3FN (Dependencia Transitiva)", text: "tercera forma normal 3fn transitivas creadores patrocinador", url: "design.html#3fn" },
  { title: "E/R a Lógico N:M (Acción 'Sacar')", text: "relaciones n:m tabla intermedia sacar minuto clave compuesta fk", url: "design.html#n:m" },
  { title: "SQL DDL (Restricciones CHECK y FK)", text: "create table primary key foreign key constraints check cascade restrict alter table chk_temporada_rango", url: "sql.html#constraints" },
  { title: "SQL DML (SELECT, INSERT, DELETE)", text: "select insert update delete inner join left join right join subconsultas", url: "sql.html#dml" },
  { title: "SQL DML (UPDATE con INNER JOIN)", text: "update e set set e.salario from empleados inner join mysql t-sql join", url: "sql.html#update" },
  { title: "SQL DCL (Seguridad de Accesos)", text: "create role grant select deny insert delete revoke security accesos dcl", url: "sql.html#dcl" },
  { title: "MySQL (AUTO_INCREMENT y Paginación)", text: "auto_increment limit offset paginacion eficiente cursor getdate timestamp select last_insert_id", url: "mysql.html#auto_increment" },
  { title: "MySQL (Funciones de Fecha y Texto)", text: "now curdate date_add datediff date_format concat lower upper trim replace", url: "mysql.html#fecha" },
  { title: "MySQL (Procedimientos Almacenados)", text: "stored procedures delimiter call in out", url: "mysql.html#procedimientos" },
  { title: "MSSQL (Stored Procedures)", text: "stored procedures sp_ProcesarBonoEmpleado if/else conditional print parameter passing", url: "mssql.html#stored" },
  { title: "MSSQL (Funciones UDF)", text: "user defined functions scalar functions returns declare set return udf", url: "mssql.html#udf" },
  { title: "MSSQL (Triggers AFTER DELETE)", text: "triggers after delete deleted inserted auditoria_empleados", url: "mssql.html#triggers" },
  { title: "MSSQL (Tablas Temporales)", text: "tablas temporales local global # ## variable tabla @", url: "mssql.html#temporales" },
  { title: "MSSQL (SQL Dinámico)", text: "sql dinamico sp_executesql executesql quotename", url: "mssql.html#dinamico" },
  { title: "MongoDB (Teorema CAP y BASE)", text: "teorema cap base eventual consistency consistencia eventual sql vs nosql", url: "mongodb.html#cap" },
  { title: "MongoDB (CRUD y Operadores)", text: "find findone insertone updateone deleteone gt gte lt lte ne and or", url: "mongodb.html#crud" },
  { title: "MongoDB (Proyecciones de find())", text: "proyecciones find inclusion exclusion _id show hide fields", url: "mongodb.html#proyecciones" },
  { title: "MongoDB (Aggregation Pipeline)", text: "aggregate pipeline match group project sort limit lookup unwind", url: "mongodb.html#aggregation" },
  { title: "MongoDB (Índices)", text: "createindex unique getindexes dropindex", url: "mongodb.html#indices" },
  { title: "DTD (Introducción y Sintaxis)", text: "document type definition xml validation elements attributes entities pcdata cdata", url: "dtd.html#introduccion" },
  { title: "DTD (Interna vs Externa)", text: "dtd interna externa doctype system", url: "dtd.html#interna" },
  { title: "DTD (Declaración de Elementos)", text: "element elementos element pcdata empty any mixed cardinality", url: "dtd.html#elementos" },
  { title: "DTD (Declaración de Atributos)", text: "attlist atributos attributes cdata required implied fixed id idref idrefs", url: "dtd.html#atributos" },
  { title: "DTD (Entidades Generales y de Parámetro)", text: "entity entities generales parametro % aviso_legal SYSTEM PUBLIC", url: "dtd.html#entidades" },
  { title: "XSD (Estructura y Tipos)", text: "xml schema definition types simple complex sequence all choice minoccurs maxoccurs", url: "xsd.html#introduccion" },
  { title: "XSD (Restricciones Facets)", text: "facets mininclusive maxinclusive pattern enumeration length minlength maxlength", url: "xsd.html#restricciones" },
  { title: "XSD (Namespaces)", text: "namespaces targetnamespace xmlns schema", url: "xsd.html#namespaces" },
  { title: "XSD vs DTD (Comparativa)", text: "comparativa dtd vs xsd diferencias table", url: "xsd.html#comparativa" }
];

// 3. Dynamic Styles Injection (Navbar, Theme Toggles, Copy Buttons)
const sharedStyles = `
/* Theme Colors Variables */
:root {
  --nav-bg: rgba(30, 30, 46, 0.9);
  --body-bg: #f8f9fa;
  --text-color: #212529;
  --card-bg: #ffffff;
}

body.dark-theme {
  --body-bg: #0f0f16;
  --text-color: #f1f5f9;
  --card-bg: #1a1a26;
  background-color: var(--body-bg) !important;
  color: var(--text-color) !important;
}

/* Glassmorphism Navbar */
.bg-dark-glass {
  background: var(--nav-bg) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.75);
}
.navbar-dark .navbar-nav .nav-link.active, .navbar-dark .navbar-nav .nav-link:hover {
  color: #fff !important;
  font-weight: 600;
}

/* Dark mode styling overrides */
body.dark-theme .card {
  background-color: var(--card-bg) !important;
  color: var(--text-color) !important;
  border: 1px solid #2d2d3e !important;
}
body.dark-theme h3, body.dark-theme h4 {
  color: #f1f5f9 !important;
}
body.dark-theme p, body.dark-theme li, body.dark-theme .text-muted {
  color: #94a3b8 !important;
}
body.dark-theme table {
  color: #e2e8f0 !important;
  border-color: #2d2d3e !important;
}
body.dark-theme td, body.dark-theme th {
  background-color: transparent !important;
  border-color: #2d2d3e !important;
}
body.dark-theme .table-light, body.dark-theme .table-secondary {
  background-color: #252538 !important;
  color: #f1f5f9 !important;
}
body.dark-theme .accordion-button {
  background-color: #1e1e2d !important;
  color: #f1f5f9 !important;
  border-color: #2d2d3e !important;
}
body.dark-theme .accordion-item {
  border-color: #2d2d3e !important;
  background-color: #1a1a26 !important;
}
body.dark-theme .accordion-body {
  background-color: #151520 !important;
  color: #cbd5e1 !important;
}

/* Copy Button Container */
.pre-container {
  position: relative;
  margin-bottom: 1.5rem;
}
.copy-code-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  background-color: #334155;
  color: #f8fafc;
  border: none;
  opacity: 0.35;
  transition: opacity 0.2s, background-color 0.2s;
}
.pre-container:hover .copy-code-btn {
  opacity: 0.95;
}
.copy-code-btn:hover {
  background-color: #475569;
}

/* Search Dropdown styling */
#search-results-box {
  max-height: 380px;
  overflow-y: auto;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}
.search-result-item {
  background-color: #fff;
  color: #212529;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  text-decoration: none;
  display: block;
}
.search-result-item:hover {
  background-color: #f1f5f9;
}
body.dark-theme .search-result-item {
  background-color: #1e1e2d;
  color: #f1f5f9;
  border-color: #2d2d3e;
}
body.dark-theme .search-result-item:hover {
  background-color: #2d2d3e;
}
.text-primary-gradient {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Estilo del buscador redondeado y blanco */
.search-container {
  position: relative;
  max-width: 250px;
  width: 100%;
}
.search-input-pill {
  border-radius: 50px !important;
  background-color: rgba(255, 255, 255, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
  padding-left: 2.25rem !important;
  padding-right: 1rem !important;
  font-size: 0.85rem !important;
  height: 34px !important;
  transition: all 0.2s ease-in-out;
}
.search-input-pill::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}
.search-input-pill:focus {
  background-color: rgba(255, 255, 255, 0.22) !important;
  border-color: rgba(255, 255, 255, 0.75) !important;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.25) !important;
  color: #ffffff !important;
}
.search-icon-inside {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.75);
  pointer-events: none;
  z-index: 5;
  font-size: 0.85rem;
}

/* Pulse highlight animation for clicked search targets */
@keyframes search-pulse {
  0% {
    background-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.45);
  }
  100% {
    background-color: transparent;
    box-shadow: none;
  }
}
.search-highlight-pulse {
  animation: search-pulse 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  border-radius: 0.5rem;
  padding: 0.3rem 0.6rem;
}

/* Responsive Accordion and Study Area */
.accordion-button {
  white-space: normal !important;
  text-align: left;
  line-height: 1.4;
  padding: 0.9rem 1.1rem;
}
@media (max-width: 576px) {
  .accordion-button {
    font-size: 0.88rem !important;
    padding: 0.75rem 0.9rem;
  }
}

/* Premium IDE Editor Skin */
.editor-wrapper {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
body.dark-theme .editor-wrapper {
  border-color: #2d2d3e;
  background-color: #151520;
}

.editor-header {
  background-color: #f1f5f9;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 0.75rem;
  height: 36px;
}
body.dark-theme .editor-header {
  background-color: #0f0f16;
  border-bottom-color: #2d2d3e;
}

.editor-tab {
  height: 36px;
  padding: 0 0.85rem;
  background-color: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  border-bottom: 2px solid #3b82f6;
}
body.dark-theme .editor-tab {
  background-color: #151520;
  border-right-color: #2d2d3e;
  border-bottom-color: #60a5fa;
}

.editor-filename {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-color) !important;
}

.editor-action-btn {
  font-size: 0.95rem;
  color: #64748b !important;
  transition: all 0.15s ease;
}
.editor-action-btn:hover {
  color: #3b82f6 !important;
  transform: scale(1.1);
}

.study-scratchpad {
  width: 100%;
  min-height: 120px;
  border: none !important;
  border-radius: 0 !important;
  padding: 0.75rem 0.9rem !important;
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.86rem !important;
  line-height: 1.5;
  background-color: #ffffff !important;
  color: #1e293b !important;
  resize: vertical;
}
body.dark-theme .study-scratchpad {
  background-color: #151520 !important;
  color: #e2e8f0 !important;
}
.study-scratchpad:focus {
  outline: none !important;
  box-shadow: none !important;
}

.editor-statusbar {
  background-color: #f8fafc;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  font-size: 0.72rem;
}
body.dark-theme .editor-statusbar {
  background-color: #0f0f16;
  border-top-color: #2d2d3e;
}

/* Pulsing dot for saving state */
.pulse-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
  margin-right: 4px;
  animation: dot-pulse 1.6s infinite ease-in-out;
}
@keyframes dot-pulse {
  0% { transform: scale(0.85); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.85); opacity: 0.6; }
}

.btn-solution-toggle {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
  transition: all 0.2s ease-in-out;
}

/* Absolute High Contrast Solution Box */
.solution-box {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  padding: 1.25rem;
  color: #0f172a !important; /* Extremely high contrast solid dark color */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}
body.dark-theme .solution-box {
  background-color: #0f0f16;
  border-color: #3b82f6;
  color: #f8fafc !important; /* Perfect crisp white under dark theme */
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
}

.solution-box p, 
.solution-box div, 
.solution-box li, 
.solution-box span, 
.solution-box strong {
  color: inherit; /* Prevent inline classes from overriding high-contrast */
}

.solution-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #2563eb !important;
}
body.dark-theme .solution-title {
  color: #60a5fa !important;
}

/* High Contrast Override for Highlighted Codes inside Solution Box */
.solution-box .cm { color: #475569 !important; }
body.dark-theme .solution-box .cm { color: #94a3b8 !important; }
.solution-box .kw { color: #0f766e !important; font-weight: bold; }
body.dark-theme .solution-box .kw { color: #2dd4bf !important; font-weight: bold; }
.solution-box .fn { color: #1d4ed8 !important; }
body.dark-theme .solution-box .fn { color: #60a5fa !important; }
`;

// 4. Dynamic Anchor Scrolling and Highlighting Logic
function handleDynamicHashScroll() {
  const hash = window.location.hash;
  if (!hash) return;

  const targetId = decodeURIComponent(hash.substring(1)).toLowerCase().trim();
  if (!targetId) return;

  // 1. Try to find by exact matching ID attribute
  let targetEl = document.getElementById(targetId);

  // 2. Fallback: Search in headings dynamically
  if (!targetEl) {
    const headings = document.querySelectorAll("h2, h3, h4, .card-title");
    for (let heading of headings) {
      const text = heading.textContent.toLowerCase();
      if (text.includes(targetId) || targetId.includes(text)) {
        heading.id = targetId;
        targetEl = heading;
        break;
      }
    }
  }

  // 3. Scroll to target elegantly and flash the pulse
  if (targetEl) {
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      targetEl.classList.add("search-highlight-pulse");
      
      // Clean up pulse class after animation completes
      setTimeout(() => {
        targetEl.classList.remove("search-highlight-pulse");
      }, 2500);
    }, 250);
  }
}

// 5. Prepend Navbar, wrap code, configure search & theme toggles
document.addEventListener("DOMContentLoaded", () => {
  // A. Inject CSS
  const styleEl = document.createElement("style");
  styleEl.innerHTML = sharedStyles;
  document.head.appendChild(styleEl);

  // B. Construct Navbar HTML
  const navHtml = `
  <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark-glass py-2 shadow-sm">
      <div class="container-fluid px-3">
          <a class="navbar-brand fw-bold d-flex align-items-center" href="index.html">
              <i class="bi bi-book me-2 text-primary"></i> Wiki Técnica
          </a>
          <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item"><a class="nav-link" id="nav-home" href="index.html"><i class="bi bi-house-door me-1"></i> Inicio</a></li>
                  <li class="nav-item"><a class="nav-link" id="nav-design" href="design.html"><i class="bi bi-rulers me-1"></i> Diseño</a></li>
                  <li class="nav-item"><a class="nav-link" id="nav-sql" href="sql.html"><i class="bi bi-database me-1"></i> SQL</a></li>
                  <li class="nav-item"><a class="nav-link" id="nav-mysql" href="mysql.html"><i class="bi bi-server me-1"></i> MySQL</a></li>
                  <li class="nav-item"><a class="nav-link" id="nav-mssql" href="mssql.html"><i class="bi bi-diagram-3 me-1"></i> MSSQL</a></li>
                  <li class="nav-item"><a class="nav-link" id="nav-mongo" href="mongodb.html"><i class="bi bi-braces me-1"></i> MongoDB</a></li>
                  <li class="nav-item"><a class="nav-link" id="nav-dtd" href="dtd.html"><i class="bi bi-file-earmark-code me-1"></i> DTD</a></li>
                  <li class="nav-item"><a class="nav-link" id="nav-xsd" href="xsd.html"><i class="bi bi-filetype-xml me-1"></i> XSD</a></li>
              </ul>
              <div class="d-flex align-items-center position-relative mt-2 mt-lg-0">
                  <div class="search-container">
                      <i class="bi bi-search search-icon-inside"></i>
                      <input class="form-control search-input-pill shadow-none" type="search" placeholder="Buscar en la wiki..." id="global-search-input" autocomplete="off">
                  </div>
                  <div id="search-results-box" class="list-group position-absolute shadow border-0 d-none" style="top: 100%; right: 0; min-width: 320px; z-index: 1050;"></div>
                  <button class="btn btn-sm btn-outline-secondary ms-2 border-0" id="theme-toggle" title="Alternar tema oscuro">
                      <i class="bi bi-moon-fill text-light" id="theme-icon"></i>
                  </button>
              </div>
          </div>
      </div>
  </nav>
  `;

  // C. Prepend navbar inside body
  const body = document.body;
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = navHtml.trim();
  const navElement = tempDiv.firstChild;
  body.insertBefore(navElement, body.firstChild);

  // D. Highlight active page link in Navbar
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "index.html" || currentPage === "") {
    document.getElementById("nav-home")?.classList.add("active");
  } else if (currentPage === "design.html") {
    document.getElementById("nav-design")?.classList.add("active");
  } else if (currentPage === "sql.html") {
    document.getElementById("nav-sql")?.classList.add("active");
  } else if (currentPage === "mysql.html") {
    document.getElementById("nav-mysql")?.classList.add("active");
  } else if (currentPage === "mssql.html") {
    document.getElementById("nav-mssql")?.classList.add("active");
  } else if (currentPage === "mongodb.html") {
    document.getElementById("nav-mongo")?.classList.add("active");
  } else if (currentPage === "dtd.html") {
    document.getElementById("nav-dtd")?.classList.add("active");
  } else if (currentPage === "xsd.html") {
    document.getElementById("nav-xsd")?.classList.add("active");
  }

  // E. Dark Theme Switcher Logic
  const savedTheme = localStorage.getItem("theme");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    themeIcon.className = "bi bi-sun-fill text-warning";
  } else {
    body.classList.remove("dark-theme");
    themeIcon.className = "bi bi-moon-fill text-light";
  }

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
      localStorage.setItem("theme", "dark");
      themeIcon.className = "bi bi-sun-fill text-warning";
    } else {
      localStorage.setItem("theme", "light");
      themeIcon.className = "bi bi-moon-fill text-light";
    }
  });

  // F. Wrap Code Blocks with Copy Button
  document.querySelectorAll("pre").forEach(pre => {
    if (pre.parentNode.className !== "pre-container") {
      const wrapper = document.createElement("div");
      wrapper.className = "pre-container";
      
      const btn = document.createElement("button");
      btn.className = "copy-code-btn btn";
      btn.innerHTML = '<i class="bi bi-clipboard"></i> Copiar';
      
      btn.addEventListener("click", () => {
        const codeText = pre.innerText.trim();
        navigator.clipboard.writeText(codeText).then(() => {
          btn.innerHTML = '<i class="bi bi-check2"></i> Copiado';
          btn.style.backgroundColor = "#22c55e";
          setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-clipboard"></i> Copiar';
            btn.style.backgroundColor = "#334155";
          }, 1500);
        });
      });

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(btn);
    }
  });

  // G. Dynamic Search Box logic
  const searchInput = document.getElementById("global-search-input");
  const searchResultsBox = document.getElementById("search-results-box");

  searchInput?.addEventListener("input", () => {
    const val = searchInput.value.toLowerCase().trim();
    if (!val) {
      searchResultsBox.classList.add("d-none");
      searchResultsBox.innerHTML = "";
      return;
    }

    const matches = searchIndex.filter(item => 
      item.title.toLowerCase().includes(val) || 
      item.text.toLowerCase().includes(val)
    );

    if (matches.length === 0) {
      searchResultsBox.innerHTML = '<div class="search-result-item text-muted text-center small py-3">No se encontraron resultados</div>';
      searchResultsBox.classList.remove("d-none");
      return;
    }

    let resultHtml = "";
    matches.forEach(match => {
      resultHtml += `
        <a href="${match.url}" class="search-result-item">
          <div class="fw-bold small">${match.title}</div>
          <div class="text-muted" style="font-size: 0.72rem;">Sección: ${match.url.includes("#") ? match.url.split("#")[1].toUpperCase() : "INICIO"}</div>
        </a>
      `;
    });
    searchResultsBox.innerHTML = resultHtml;
    searchResultsBox.classList.remove("d-none");
  });

  // Hide search container when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchInput?.contains(e.target) && !searchResultsBox?.contains(e.target)) {
      searchResultsBox?.classList.add("d-none");
    }
  });

  // H. Inject Self-Assessment Quiz at the bottom of the main container
  const pageKey = currentPage === "" ? "index.html" : currentPage;
  const qList = examQuestions[pageKey];
  if (qList && qList.length > 0) {
    const main = document.querySelector("main");
    if (main) {
      const quizSection = document.createElement("section");
      quizSection.className = "mt-5 border-top pt-4";
      
      let accordionItems = "";
      qList.forEach((item, index) => {
        const savedAnswer = localStorage.getItem(`exam_${pageKey}_${index}`) || "";
        accordionItems += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingQuiz${index}">
              <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseQuiz${index}" aria-expanded="false" aria-controls="collapseQuiz${index}">
                <div class="d-flex align-items-start">
                  <i class="bi bi-question-circle text-primary me-2 mt-1" style="flex-shrink: 0;"></i> 
                  <span>${item.q}</span>
                </div>
              </button>
            </h2>
            <div id="collapseQuiz${index}" class="accordion-collapse collapse" aria-labelledby="headingQuiz${index}" data-bs-parent="#examQuizAccordion">
              <div class="accordion-body">
                <!-- Zona de Borrador / Editor de Práctica -->
                <div class="mb-3">
                  <label class="form-label small fw-bold text-secondary mb-1">
                    <i class="bi bi-pencil-square"></i> Tu práctica / borrador de código (se guarda automáticamente):
                  </label>
                  <div class="editor-wrapper mb-3 shadow-sm">
                    <!-- IDE File Tab Header Bar -->
                    <div class="editor-header d-flex align-items-center justify-content-between">
                      <div class="editor-tab d-flex align-items-center active">
                        <i class="bi bi-file-earmark-code text-primary me-2"></i>
                        <span class="editor-filename font-monospace text-secondary" style="font-size: 0.76rem;">${getPageTabName(pageKey)}</span>
                      </div>
                      <div class="editor-actions d-flex align-items-center gap-2">
                        <button class="editor-action-btn btn btn-link text-muted p-0" title="Copiar código" onclick="copyScratchpadText('${pageKey}', ${index})">
                          <i class="bi bi-clipboard"></i>
                        </button>
                        <button class="editor-action-btn btn btn-link text-muted p-0" title="Borrar todo" onclick="clearScratchpadText('${pageKey}', ${index})">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Textarea Scratchpad -->
                    <textarea class="study-scratchpad form-control shadow-sm" 
                              placeholder="-- Escribe aquí tu propia respuesta o solución de código para practicar..." 
                              data-page="${pageKey}" 
                              data-index="${index}">${savedAnswer}</textarea>
                    
                    <!-- Editor Status Bar -->
                    <div class="editor-statusbar d-flex align-items-center justify-content-between px-2 py-1 small text-muted">
                      <div>
                        <span class="saving-indicator text-success" id="saveIndicator-${pageKey}-${index}">
                          <span class="pulse-dot"></span> Sincronizado
                        </span>
                      </div>
                      <div class="editor-stats">
                        <span id="charCount-${pageKey}-${index}">${savedAnswer.length}</span> caracteres
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Toggle de Solución Oficial -->
                <div class="mb-2">
                  <button class="btn btn-sm btn-outline-primary btn-solution-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#solutionBody${index}" aria-expanded="false" aria-controls="solutionBody${index}">
                    <i class="bi bi-eye"></i> Mostrar / Ocultar Solución Oficial
                  </button>
                </div>
                
                <!-- Solución oficial colapsable -->
                <div class="collapse mt-3" id="solutionBody${index}">
                  <div class="solution-box shadow-sm">
                    <div class="solution-title mb-2">
                      <i class="bi bi-patch-check-fill me-1"></i> Solución Oficial Sugerida:
                    </div>
                    <div style="line-height: 1.6; font-size: 0.88rem;">${item.a}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      });
      
      quizSection.innerHTML = `
        <div class="card shadow-sm border-0 mb-4 bg-transparent">
          <div class="card-body p-0">
            <h3 class="fw-bold mb-2 text-primary-gradient d-flex align-items-center"><i class="bi bi-patch-check-fill text-primary me-2"></i> Preguntas de Examen &amp; Autoevaluación</h3>
            <p class="small text-muted mb-3">Prepárate para los exámenes de desarrollo. Utiliza los editores de borrador integrados para practicar y haz clic en el botón inferior de cada pregunta para verificar tus respuestas:</p>
            <div class="accordion shadow-sm" id="examQuizAccordion">
              ${accordionItems}
            </div>
          </div>
        </div>
      `;
      main.appendChild(quizSection);
      
      // Configure silent auto-saving for practice scratchpads
      document.querySelectorAll(".study-scratchpad").forEach(textarea => {
        const page = textarea.getAttribute("data-page");
        const index = textarea.getAttribute("data-index");
        let saveTimeout;
        
        textarea.addEventListener("input", (e) => {
          const value = e.target.value;
          localStorage.setItem(`exam_${page}_${index}`, value);
          
          // Update stats
          const charCount = document.getElementById(`charCount-${page}-${index}`);
          if (charCount) charCount.textContent = value.length;
          
          // Visual feedback in statusbar: Guardando...
          const indicator = document.getElementById(`saveIndicator-${page}-${index}`);
          if (indicator) {
            indicator.innerHTML = '<span class="pulse-dot" style="background-color: #eab308; animation-duration: 0.6s;"></span> Guardando...';
            
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
              indicator.innerHTML = '<span class="pulse-dot"></span> Sincronizado';
            }, 600);
          }
        });
      });
    }
  }

  // I. Handle Dynamic Smooth Scroll and Highlighting on Load
  handleDynamicHashScroll();
});

// J. Listen to Hash Changes (if navigating within the same page)
window.addEventListener("hashchange", handleDynamicHashScroll);

// K. Interactive Scratchpad Helper Functions
function getPageTabName(pageKey) {
  if (pageKey.includes("design")) return "borrador_diseno.txt";
  if (pageKey.includes("sql") || pageKey.includes("mysql") || pageKey.includes("mssql")) return "practica_consulta.sql";
  if (pageKey.includes("mongodb")) return "consulta_nosql.js";
  if (pageKey.includes("dtd")) return "estructura.dtd";
  if (pageKey.includes("xsd")) return "esquema.xsd";
  return "borrador.txt";
}

window.copyScratchpadText = function(page, index) {
  const textarea = document.querySelector(`textarea[data-page="${page}"][data-index="${index}"]`);
  if (textarea) {
    navigator.clipboard.writeText(textarea.value).then(() => {
      const indicator = document.getElementById(`saveIndicator-${page}-${index}`);
      if (indicator) {
        const originalHtml = indicator.innerHTML;
        indicator.innerHTML = '<span class="pulse-dot" style="background-color: #3b82f6;"></span> ¡Copiado!';
        setTimeout(() => {
          indicator.innerHTML = originalHtml;
        }, 1500);
      }
    });
  }
};

window.clearScratchpadText = function(page, index) {
  const textarea = document.querySelector(`textarea[data-page="${page}"][data-index="${index}"]`);
  if (textarea) {
    textarea.value = "";
    localStorage.setItem(`exam_${page}_${index}`, "");
    textarea.dispatchEvent(new Event('input'));
  }
};
