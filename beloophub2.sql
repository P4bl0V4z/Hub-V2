--
-- PostgreSQL database dump
--

\restrict JHz2olrkBxe4N7eIx6PdKeDtSQ91Mlh4VVvllCC8z5vkg9484VX4HzjPkahLz4m

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 17.6 (Debian 17.6-1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: hubuser
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO hubuser;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: hubuser
--

COMMENT ON SCHEMA public IS '';


--
-- Name: NivelAcceso; Type: TYPE; Schema: public; Owner: hubuser
--

CREATE TYPE public."NivelAcceso" AS ENUM (
    'SIN_DEFINIR',
    'SIN_ACCESO',
    'VER',
    'EDITAR'
);


ALTER TYPE public."NivelAcceso" OWNER TO hubuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Empresa; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."Empresa" (
    id integer NOT NULL,
    nombre text NOT NULL,
    creado_en timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "esEmpresaMaestra" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Empresa" OWNER TO hubuser;

--
-- Name: Empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."Empresa_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Empresa_id_seq" OWNER TO hubuser;

--
-- Name: Empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."Empresa_id_seq" OWNED BY public."Empresa".id;


--
-- Name: ObjetoSistema; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."ObjetoSistema" (
    id integer NOT NULL,
    key text NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ObjetoSistema" OWNER TO hubuser;

--
-- Name: ObjetoSistema_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."ObjetoSistema_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ObjetoSistema_id_seq" OWNER TO hubuser;

--
-- Name: ObjetoSistema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."ObjetoSistema_id_seq" OWNED BY public."ObjetoSistema".id;


--
-- Name: Question; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."Question" (
    id integer NOT NULL,
    "testId" integer NOT NULL,
    texto text NOT NULL
);


ALTER TABLE public."Question" OWNER TO hubuser;

--
-- Name: Question_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."Question_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Question_id_seq" OWNER TO hubuser;

--
-- Name: Question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."Question_id_seq" OWNED BY public."Question".id;


--
-- Name: Rol; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."Rol" (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    "soloEmpresaMaestra" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Rol" OWNER TO hubuser;

--
-- Name: RolAcceso; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."RolAcceso" (
    id integer NOT NULL,
    rol_id integer NOT NULL,
    objeto_sistema_id integer NOT NULL,
    nivel public."NivelAcceso" DEFAULT 'SIN_DEFINIR'::public."NivelAcceso" NOT NULL
);


ALTER TABLE public."RolAcceso" OWNER TO hubuser;

--
-- Name: RolAcceso_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."RolAcceso_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RolAcceso_id_seq" OWNER TO hubuser;

--
-- Name: RolAcceso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."RolAcceso_id_seq" OWNED BY public."RolAcceso".id;


--
-- Name: Rol_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."Rol_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Rol_id_seq" OWNER TO hubuser;

--
-- Name: Rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."Rol_id_seq" OWNED BY public."Rol".id;


--
-- Name: Test; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."Test" (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public."Test" OWNER TO hubuser;

--
-- Name: TestAttempt; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."TestAttempt" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "testId" integer NOT NULL,
    label text,
    "attemptNumber" integer DEFAULT 1 NOT NULL,
    "startedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone,
    score double precision,
    progress jsonb NOT NULL
);


ALTER TABLE public."TestAttempt" OWNER TO hubuser;

--
-- Name: TestAttempt_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."TestAttempt_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TestAttempt_id_seq" OWNER TO hubuser;

--
-- Name: TestAttempt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."TestAttempt_id_seq" OWNED BY public."TestAttempt".id;


--
-- Name: Test_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."Test_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Test_id_seq" OWNER TO hubuser;

--
-- Name: Test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."Test_id_seq" OWNED BY public."Test".id;


--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."Usuario" (
    id integer NOT NULL,
    email text NOT NULL,
    password text,
    nombre text NOT NULL,
    creado_en timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actualizado_en timestamp(3) without time zone NOT NULL,
    token_verificacion text,
    activo boolean DEFAULT false NOT NULL,
    verificado_en timestamp(3) without time zone,
    tipo_usuario text,
    google_id text,
    ms_id text,
    avatar_url text,
    last_login_at timestamp(3) without time zone
);


ALTER TABLE public."Usuario" OWNER TO hubuser;

--
-- Name: UsuarioEmpresa; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."UsuarioEmpresa" (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    empresa_id integer NOT NULL
);


ALTER TABLE public."UsuarioEmpresa" OWNER TO hubuser;

--
-- Name: UsuarioEmpresa_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."UsuarioEmpresa_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UsuarioEmpresa_id_seq" OWNER TO hubuser;

--
-- Name: UsuarioEmpresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."UsuarioEmpresa_id_seq" OWNED BY public."UsuarioEmpresa".id;


--
-- Name: UsuarioRol; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public."UsuarioRol" (
    id integer NOT NULL,
    usuario_empresa_id integer NOT NULL,
    rol_id integer NOT NULL
);


ALTER TABLE public."UsuarioRol" OWNER TO hubuser;

--
-- Name: UsuarioRol_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."UsuarioRol_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UsuarioRol_id_seq" OWNER TO hubuser;

--
-- Name: UsuarioRol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."UsuarioRol_id_seq" OWNED BY public."UsuarioRol".id;


--
-- Name: Usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: hubuser
--

CREATE SEQUENCE public."Usuario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuario_id_seq" OWNER TO hubuser;

--
-- Name: Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubuser
--

ALTER SEQUENCE public."Usuario_id_seq" OWNED BY public."Usuario".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: hubuser
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO hubuser;

--
-- Name: Empresa id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Empresa" ALTER COLUMN id SET DEFAULT nextval('public."Empresa_id_seq"'::regclass);


--
-- Name: ObjetoSistema id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."ObjetoSistema" ALTER COLUMN id SET DEFAULT nextval('public."ObjetoSistema_id_seq"'::regclass);


--
-- Name: Question id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Question" ALTER COLUMN id SET DEFAULT nextval('public."Question_id_seq"'::regclass);


--
-- Name: Rol id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Rol" ALTER COLUMN id SET DEFAULT nextval('public."Rol_id_seq"'::regclass);


--
-- Name: RolAcceso id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."RolAcceso" ALTER COLUMN id SET DEFAULT nextval('public."RolAcceso_id_seq"'::regclass);


--
-- Name: Test id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Test" ALTER COLUMN id SET DEFAULT nextval('public."Test_id_seq"'::regclass);


--
-- Name: TestAttempt id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."TestAttempt" ALTER COLUMN id SET DEFAULT nextval('public."TestAttempt_id_seq"'::regclass);


--
-- Name: Usuario id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Usuario_id_seq"'::regclass);


--
-- Name: UsuarioEmpresa id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioEmpresa" ALTER COLUMN id SET DEFAULT nextval('public."UsuarioEmpresa_id_seq"'::regclass);


--
-- Name: UsuarioRol id; Type: DEFAULT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioRol" ALTER COLUMN id SET DEFAULT nextval('public."UsuarioRol_id_seq"'::regclass);


--
-- Data for Name: Empresa; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."Empresa" (id, nombre, creado_en, "esEmpresaMaestra") FROM stdin;
1	BeLoop	2025-10-04 13:23:53.625	t
\.


--
-- Data for Name: ObjetoSistema; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."ObjetoSistema" (id, key, nombre, descripcion, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Question; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."Question" (id, "testId", texto) FROM stdin;
\.


--
-- Data for Name: Rol; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."Rol" (id, nombre, descripcion, "soloEmpresaMaestra") FROM stdin;
1	admin	Usuario administrador del sistema	t
\.


--
-- Data for Name: RolAcceso; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."RolAcceso" (id, rol_id, objeto_sistema_id, nivel) FROM stdin;
\.


--
-- Data for Name: Test; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."Test" (id, nombre) FROM stdin;
\.


--
-- Data for Name: TestAttempt; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."TestAttempt" (id, "userId", "testId", label, "attemptNumber", "startedAt", "updatedAt", completed, "completedAt", score, progress) FROM stdin;
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."Usuario" (id, email, password, nombre, creado_en, actualizado_en, token_verificacion, activo, verificado_en, tipo_usuario, google_id, ms_id, avatar_url, last_login_at) FROM stdin;
1	admin@beloop.io	$2b$12$6CbY56PQgferK1axD3AX8.vxSSwgNc/DPp0F/KLViTuj1ydO1te4y	admin	2025-10-04 13:23:54.015	2025-10-05 22:12:56.789	\N	t	\N	\N	\N	\N	\N	2025-10-05 22:12:56.787
\.


--
-- Data for Name: UsuarioEmpresa; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."UsuarioEmpresa" (id, usuario_id, empresa_id) FROM stdin;
1	1	1
\.


--
-- Data for Name: UsuarioRol; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public."UsuarioRol" (id, usuario_empresa_id, rol_id) FROM stdin;
1	1	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: hubuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
2a16ddfe-703c-4265-be25-fa74ebc4f161	2c081414d63f2d3ebe302cb862eaa0c36cadc22c3971240090dac7f1a7634de8	2025-10-04 13:20:00.447586+00	0000_initial_baseline	\N	\N	2025-10-04 13:20:00.413405+00	1
78001e8e-a96e-46d9-a3c2-51216041741e	f7d1259a4840a01f9c30401bb37a1f4165aac0c79283e51e618dc90b9a8e6709	2025-10-05 22:31:58.728867+00	20251005223158_tests	\N	\N	2025-10-05 22:31:58.657916+00	1
\.


--
-- Name: Empresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."Empresa_id_seq"', 1, true);


--
-- Name: ObjetoSistema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."ObjetoSistema_id_seq"', 1, false);


--
-- Name: Question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."Question_id_seq"', 1, false);


--
-- Name: RolAcceso_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."RolAcceso_id_seq"', 1, false);


--
-- Name: Rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."Rol_id_seq"', 1, true);


--
-- Name: TestAttempt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."TestAttempt_id_seq"', 1, false);


--
-- Name: Test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."Test_id_seq"', 1, false);


--
-- Name: UsuarioEmpresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."UsuarioEmpresa_id_seq"', 1, true);


--
-- Name: UsuarioRol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."UsuarioRol_id_seq"', 1, true);


--
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hubuser
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 1, true);


--
-- Name: Empresa Empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Empresa"
    ADD CONSTRAINT "Empresa_pkey" PRIMARY KEY (id);


--
-- Name: ObjetoSistema ObjetoSistema_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."ObjetoSistema"
    ADD CONSTRAINT "ObjetoSistema_pkey" PRIMARY KEY (id);


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: RolAcceso RolAcceso_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."RolAcceso"
    ADD CONSTRAINT "RolAcceso_pkey" PRIMARY KEY (id);


--
-- Name: Rol Rol_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Rol"
    ADD CONSTRAINT "Rol_pkey" PRIMARY KEY (id);


--
-- Name: TestAttempt TestAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."TestAttempt"
    ADD CONSTRAINT "TestAttempt_pkey" PRIMARY KEY (id);


--
-- Name: Test Test_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Test"
    ADD CONSTRAINT "Test_pkey" PRIMARY KEY (id);


--
-- Name: UsuarioEmpresa UsuarioEmpresa_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioEmpresa"
    ADD CONSTRAINT "UsuarioEmpresa_pkey" PRIMARY KEY (id);


--
-- Name: UsuarioRol UsuarioRol_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioRol"
    ADD CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY (id);


--
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Empresa_esEmpresaMaestra_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "Empresa_esEmpresaMaestra_idx" ON public."Empresa" USING btree ("esEmpresaMaestra");


--
-- Name: Empresa_nombre_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "Empresa_nombre_key" ON public."Empresa" USING btree (nombre);


--
-- Name: ObjetoSistema_key_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "ObjetoSistema_key_key" ON public."ObjetoSistema" USING btree (key);


--
-- Name: RolAcceso_nivel_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "RolAcceso_nivel_idx" ON public."RolAcceso" USING btree (nivel);


--
-- Name: RolAcceso_objeto_sistema_id_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "RolAcceso_objeto_sistema_id_idx" ON public."RolAcceso" USING btree (objeto_sistema_id);


--
-- Name: RolAcceso_rol_id_objeto_sistema_id_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "RolAcceso_rol_id_objeto_sistema_id_key" ON public."RolAcceso" USING btree (rol_id, objeto_sistema_id);


--
-- Name: Rol_nombre_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "Rol_nombre_key" ON public."Rol" USING btree (nombre);


--
-- Name: TestAttempt_testId_completedAt_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "TestAttempt_testId_completedAt_idx" ON public."TestAttempt" USING btree ("testId", "completedAt");


--
-- Name: TestAttempt_userId_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "TestAttempt_userId_idx" ON public."TestAttempt" USING btree ("userId");


--
-- Name: TestAttempt_userId_testId_attemptNumber_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "TestAttempt_userId_testId_attemptNumber_key" ON public."TestAttempt" USING btree ("userId", "testId", "attemptNumber");


--
-- Name: TestAttempt_userId_testId_completed_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "TestAttempt_userId_testId_completed_idx" ON public."TestAttempt" USING btree ("userId", "testId", completed);


--
-- Name: UsuarioEmpresa_empresa_id_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "UsuarioEmpresa_empresa_id_idx" ON public."UsuarioEmpresa" USING btree (empresa_id);


--
-- Name: UsuarioEmpresa_usuario_id_empresa_id_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "UsuarioEmpresa_usuario_id_empresa_id_key" ON public."UsuarioEmpresa" USING btree (usuario_id, empresa_id);


--
-- Name: UsuarioEmpresa_usuario_id_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "UsuarioEmpresa_usuario_id_idx" ON public."UsuarioEmpresa" USING btree (usuario_id);


--
-- Name: UsuarioRol_rol_id_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "UsuarioRol_rol_id_idx" ON public."UsuarioRol" USING btree (rol_id);


--
-- Name: UsuarioRol_usuario_empresa_id_rol_id_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "UsuarioRol_usuario_empresa_id_rol_id_key" ON public."UsuarioRol" USING btree (usuario_empresa_id, rol_id);


--
-- Name: Usuario_email_idx; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE INDEX "Usuario_email_idx" ON public."Usuario" USING btree (email);


--
-- Name: Usuario_email_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "Usuario_email_key" ON public."Usuario" USING btree (email);


--
-- Name: Usuario_google_id_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "Usuario_google_id_key" ON public."Usuario" USING btree (google_id);


--
-- Name: Usuario_ms_id_key; Type: INDEX; Schema: public; Owner: hubuser
--

CREATE UNIQUE INDEX "Usuario_ms_id_key" ON public."Usuario" USING btree (ms_id);


--
-- Name: Question Question_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolAcceso RolAcceso_objeto_sistema_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."RolAcceso"
    ADD CONSTRAINT "RolAcceso_objeto_sistema_id_fkey" FOREIGN KEY (objeto_sistema_id) REFERENCES public."ObjetoSistema"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolAcceso RolAcceso_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."RolAcceso"
    ADD CONSTRAINT "RolAcceso_rol_id_fkey" FOREIGN KEY (rol_id) REFERENCES public."Rol"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestAttempt TestAttempt_testId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."TestAttempt"
    ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES public."Test"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TestAttempt TestAttempt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."TestAttempt"
    ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UsuarioEmpresa UsuarioEmpresa_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioEmpresa"
    ADD CONSTRAINT "UsuarioEmpresa_empresa_id_fkey" FOREIGN KEY (empresa_id) REFERENCES public."Empresa"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UsuarioEmpresa UsuarioEmpresa_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioEmpresa"
    ADD CONSTRAINT "UsuarioEmpresa_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UsuarioRol UsuarioRol_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioRol"
    ADD CONSTRAINT "UsuarioRol_rol_id_fkey" FOREIGN KEY (rol_id) REFERENCES public."Rol"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UsuarioRol UsuarioRol_usuario_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubuser
--

ALTER TABLE ONLY public."UsuarioRol"
    ADD CONSTRAINT "UsuarioRol_usuario_empresa_id_fkey" FOREIGN KEY (usuario_empresa_id) REFERENCES public."UsuarioEmpresa"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: hubuser
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict JHz2olrkBxe4N7eIx6PdKeDtSQ91Mlh4VVvllCC8z5vkg9484VX4HzjPkahLz4m

