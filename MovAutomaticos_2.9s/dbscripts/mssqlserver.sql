/*
NomeObjeto: MOVAUP
TipoObjeto: TABLE
NomeTabela: MOVAUP
Executar  : SE_NAO_EXISTIR
*/ 

CREATE TABLE MOVAUP 
(
  RESOURCEID VARCHAR(60) NOT NULL 
, TIPO VARCHAR(2) NOT NULL 
, PROCEDURELINHA VARCHAR(40) 
, PROCEDUREFINAL VARCHAR(40) 
, EVENTOANT VARCHAR(40) 
, CONSTRAINT MOVAUP_PK PRIMARY KEY 
  (
    RESOURCEID 
  , TIPO 
  )
)
GO

/*
NomeObjeto: MOVACB
TipoObjeto: TABLE
NomeTabela: MOVACB
Executar  : SE_NAO_EXISTIR
*/ 

CREATE TABLE MOVACB 
(
  IDMOV FLOAT NOT NULL 
, DESCRPROC VARCHAR(40) 
, CONDICAO VARCHAR(400) 
, ATIVO VARCHAR(2) 
, INSTANCIA VARCHAR(40) 
, CODINST FLOAT
, EXPRESSAO VARCHAR(400) 
, CODINSTFILHA FLOAT
, TRANSIENTFILTER VARCHAR(4000) 
, PROCEDUREFINAL VARCHAR(20) 
, CONSTRAINT MOVACB_PK PRIMARY KEY 
  (
    IDMOV 
  )
 )
GO

/*
NomeObjeto: MOVAIT
TipoObjeto: TABLE
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

CREATE TABLE MOVAIT 
(
  IDMOV FLOAT NOT NULL 
, CODTIPOPER VARCHAR(100) NOT NULL 
, CODTIPVENDA VARCHAR(100) 
, CODNAT VARCHAR(100) 
, CODCENCUS VARCHAR(100) 
, CODEMP VARCHAR(100) 
, CODLOCAL VARCHAR(100) 
, CODPARC VARCHAR(100) 
, ORDEM FLOAT NOT NULL 
, ATIVO VARCHAR(2) 
, FAT VARCHAR(2) 
, OBSERVACAO VARCHAR(4000) 
, SERIENOTA VARCHAR(100) 
, FILTRO VARCHAR(100) 
, INSTANCIAFILHA VARCHAR(40) 
, CODINSTFILHA FLOAT 
, EXPRESSAO VARCHAR(4000) 
, TRANSIENTFILTER VARCHAR(4000) 
, INSTANCIA VARCHAR(100) 
, CODPROD VARCHAR(100)
, QTDNEG VARCHAR(100) 
, CONTROLE VARCHAR(100) 
, VLRUNIT VARCHAR(100) 
, VLRDESC VARCHAR(100) 
, CONSTRAINT MOVAIT_PK PRIMARY KEY 
  (
    IDMOV 
  , ORDEM 
  )
)

GO

/*
NomeObjeto: MOVAIT_PK
TipoObjeto: PRIMARY KEY
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD CONSTRAINT MOVAIT_PK PRIMARY KEY (IDMOV, CODTIPOPER)
GO

/*
NomeObjeto: MOVACB_PK
TipoObjeto: PRIMARY KEY
NomeTabela: MOVACB
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVACB ADD CONSTRAINT MOVACB_PK PRIMARY KEY (IDMOV)
GO

/*
NomeObjeto: MOVAUP_PK
TipoObjeto: PRIMARY KEY
NomeTabela: MOVAUP
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAUP ADD CONSTRAINT MOVAUP_PK PRIMARY KEY (RESOURCEID, TIPO)
GO

/*
NomeObjeto: MOVAGE
TipoObjeto: TABLE
NomeTabela: MOVAGE
Executar  : SE_NAO_EXISTIR
*/ 

CREATE TABLE MOVAGE 
(
  ENTITYNAME VARCHAR(100) NOT NULL 
, PKQUERY VARCHAR(200) NOT NULL 
, IDMOV FLOAT NOT NULL 
, SEQUENCIA FLOAT NOT NULL 
, NUNOTA FLOAT 
, NUNOTAFAT FLOAT 
, CONSTRAINT MOVAGE_PK PRIMARY KEY 
  (
    ENTITYNAME 
  , IDMOV 
  , SEQUENCIA 
  , PKQUERY 
  )
 )

GO

/*
NomeObjeto: CODEMPNEGOC
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD CODEMPNEGOC VARCHAR(100) 
GO

/*
NomeObjeto: CODLOCALDEST
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD CODLOCALDEST VARCHAR(100) 
GO

/*
NomeObjeto: OBSERVACAO
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD OBSERVACAO VARCHAR(100) 
GO

/*
NomeObjeto: USAPRECOTOP
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD USAPRECOTOP VARCHAR(2) 
GO

/*
NomeObjeto: NAOCONFIRMA
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD NAOCONFIRMA VARCHAR(2) 
GO

/*
NomeObjeto: CODEMP_ITE
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD CODEMP_ITE VARCHAR(100) 
GO

/*
NomeObjeto: SEQUENCIA
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD SEQUENCIA VARCHAR(100) 
GO

/*
NomeObjeto: DIASRETCUSTO
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD DIASRETCUSTO INT
GO

/*
NomeObjeto: CODEMP_CUS
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD CODEMP_CUS VARCHAR(100) 
GO

/*
NomeObjeto: COPYADDFIELDS
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD COPYADDFIELDS VARCHAR(2)
GO

/*
NomeObjeto: TIPO
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD TIPO VARCHAR(2)
GO

/*
NomeObjeto: COPYADDFIELDSCAB
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD COPYADDFIELDSCAB VARCHAR(2)
GO

/*
NomeObjeto: ATRASAATUALEST
TipoObjeto: COLUMN
NomeTabela: TGFTOP
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE TGFTOP ADD ATRASAATUALEST VARCHAR(2) 
GO

/*
NomeObjeto: FORCARETIRADESC
TipoObjeto: COLUMN
NomeTabela: TGFTOP
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE TGFTOP ADD FORCARETIRADESC VARCHAR(2) 
GO

/*
NomeObjeto: FORCAFATURANDO
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD FORCAFATURANDO VARCHAR(2)
GO

/*
NomeObjeto: FORCALIB
TipoObjeto: COLUMN
NomeTabela: TGFTOP
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE TGFTOP 
ADD FORCALIB VARCHAR(2)

GO

/*
NomeObjeto: CLAVLRDESC
TipoObjeto: COLUMN
NomeTabela: TGFITE
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD CLAVLRDESC FLOAT
GO

/*
NomeObjeto: NAOCONFIRMAFAT
TipoObjeto: COLUMN
NomeTabela: MOVAIT
Executar  : SE_NAO_EXISTIR
*/ 

ALTER TABLE MOVAIT ADD NAOCONFIRMAFAT VARCHAR(2)
GO

