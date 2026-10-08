-- CreateTable
CREATE TABLE `instituicoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ds_instituicao` VARCHAR(150) NULL,
    `razao_social` VARCHAR(150) NOT NULL,
    `nome_fantasia` VARCHAR(120) NULL,
    `cnpj` CHAR(14) NULL,
    `logradouro` VARCHAR(150) NULL,
    `nro` VARCHAR(20) NULL,
    `complemento` VARCHAR(100) NULL,
    `bairro` VARCHAR(100) NULL,
    `cidade` VARCHAR(100) NULL,
    `uf` VARCHAR(2) NULL,
    `cep` VARCHAR(10) NULL,
    `nro_funcionarios` INTEGER NULL,
    `dt_alteracao` DATE NULL,
    `dt_cadastro` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesquisa_ambiente_burnout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dt_cadastro_pesquisa` DATE NULL,
    `nm_responsavel` VARCHAR(80) NULL,
    `email_responsavel` VARCHAR(100) NULL,
    `ddd_responsavel` CHAR(2) NULL,
    `fone_responsavel` VARCHAR(20) NULL,
    `cargo_responsavel` VARCHAR(50) NULL,
    `nro_funcionarios` INTEGER NULL,
    `dt_inicio_pesquisa` DATE NULL,
    `dt_fechamento_pesquisa` DATE NULL,
    `fechado` CHAR(1) NULL,
    `nome_arte` VARCHAR(200) NULL,
    `nome_arte_original` VARCHAR(200) NULL,
    `id_area_instituicao` INTEGER NULL,
    `id_instituicoes` INTEGER NOT NULL,

    INDEX `pesquisa_ambiente_burnout_id_instituicoes_idx`(`id_instituicoes`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questionario_ambiente_burnout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dt_cadastro_pesquisa` DATE NULL,
    `inf_perfil` INTEGER NULL,
    `inf_tempo_formacao_area_enfermagem` INTEGER NULL,
    `inf_titulo_graduacao` INTEGER NULL,
    `inf_cargo_enfermeiro` INTEGER NULL,
    `inf_cargo_tecnico` INTEGER NULL,
    `inf_tempo_trabalho_instituicao` INTEGER NULL,
    `inf_tempo_trabalho_cargo` INTEGER NULL,
    `inf_area_trabalho` INTEGER NULL,
    `inf_escala_trabalho` INTEGER NULL,
    `inf_turno_trabalho` INTEGER NULL,
    `inf_outro_vinculo` INTEGER NULL,
    `pesnwi_01` INTEGER NULL,
    `pesnwi_02` INTEGER NULL,
    `pesnwi_03` INTEGER NULL,
    `pesnwi_04` INTEGER NULL,
    `pesnwi_05` INTEGER NULL,
    `pesnwi_06` INTEGER NULL,
    `pesnwi_07` INTEGER NULL,
    `pesnwi_08` INTEGER NULL,
    `pesnwi_09` INTEGER NULL,
    `pesnwi_10` INTEGER NULL,
    `pesnwi_11` INTEGER NULL,
    `pesnwi_12` INTEGER NULL,
    `pesnwi_13` INTEGER NULL,
    `pesnwi_14` INTEGER NULL,
    `pesnwi_15` INTEGER NULL,
    `pesnwi_16` INTEGER NULL,
    `pesnwi_17` INTEGER NULL,
    `pesnwi_18` INTEGER NULL,
    `pesnwi_19` INTEGER NULL,
    `pesnwi_20` INTEGER NULL,
    `pesnwi_21` INTEGER NULL,
    `pesnwi_22` INTEGER NULL,
    `pesnwi_23` INTEGER NULL,
    `pesnwi_24` INTEGER NULL,
    `pesnwi_25` INTEGER NULL,
    `pesnwi_26` INTEGER NULL,
    `pesnwi_27` INTEGER NULL,
    `pesnwi_28` INTEGER NULL,
    `pesnwi_29` INTEGER NULL,
    `pesnwi_30` INTEGER NULL,
    `pesnwi_31` INTEGER NULL,
    `burnout_01` INTEGER NULL,
    `burnout_02` INTEGER NULL,
    `burnout_03` INTEGER NULL,
    `burnout_04` INTEGER NULL,
    `burnout_05` INTEGER NULL,
    `burnout_06` INTEGER NULL,
    `burnout_07` INTEGER NULL,
    `burnout_08` INTEGER NULL,
    `burnout_09` INTEGER NULL,
    `burnout_10` INTEGER NULL,
    `burnout_11` INTEGER NULL,
    `burnout_12` INTEGER NULL,
    `burnout_13` INTEGER NULL,
    `burnout_14` INTEGER NULL,
    `burnout_15` INTEGER NULL,
    `burnout_16` INTEGER NULL,
    `burnout_17` INTEGER NULL,
    `burnout_18` INTEGER NULL,
    `burnout_19` INTEGER NULL,
    `burnout_20` INTEGER NULL,
    `burnout_21` INTEGER NULL,
    `burnout_22` INTEGER NULL,
    `id_pesquisa_ambiente_burnout` INTEGER NOT NULL,

    INDEX `questionario_ambiente_burnout_id_pesquisa_ambiente_burnout_idx`(`id_pesquisa_ambiente_burnout`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dimensoes_ambiente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ds_dimensao` VARCHAR(80) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesquisa_ambiente_dimensoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pergunta` VARCHAR(20) NULL,
    `id_dimensoes_ambiente` INTEGER NOT NULL,

    INDEX `pesquisa_ambiente_dimensoes_id_dimensoes_ambiente_idx`(`id_dimensoes_ambiente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dimensoes_burnout` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ds_dimensao` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesquisa_burnout_dimensoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pergunta` VARCHAR(20) NULL,
    `id_dimensoes_burnout` INTEGER NOT NULL,

    INDEX `pesquisa_burnout_dimensoes_id_dimensoes_burnout_idx`(`id_dimensoes_burnout`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tabela_ddd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ddd` VARCHAR(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pesquisa_ambiente_burnout` ADD CONSTRAINT `pesquisa_ambiente_burnout_id_instituicoes_fkey` FOREIGN KEY (`id_instituicoes`) REFERENCES `instituicoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questionario_ambiente_burnout` ADD CONSTRAINT `questionario_ambiente_burnout_id_pesquisa_ambiente_burnout_fkey` FOREIGN KEY (`id_pesquisa_ambiente_burnout`) REFERENCES `pesquisa_ambiente_burnout`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesquisa_ambiente_dimensoes` ADD CONSTRAINT `pesquisa_ambiente_dimensoes_id_dimensoes_ambiente_fkey` FOREIGN KEY (`id_dimensoes_ambiente`) REFERENCES `dimensoes_ambiente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesquisa_burnout_dimensoes` ADD CONSTRAINT `pesquisa_burnout_dimensoes_id_dimensoes_burnout_fkey` FOREIGN KEY (`id_dimensoes_burnout`) REFERENCES `dimensoes_burnout`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
