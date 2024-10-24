"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const path_1 = __importDefault(require("path"));
const persistence_1 = __importDefault(require("./persistence"));
const ulid_1 = require("ulid");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configurar a pasta onde ficam os arquivos de template
app.set('views', path_1.default.join(__dirname, 'views'));
// Configurar EJS como a template engine
app.set('view engine', 'ejs');
// Configurar a pasta de arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path_1.default.join(__dirname, 'static')));
app.get('/index', (req, res) => {
    //res.json('ola mundo');
    //res.sendFile(path.join(__dirname, 'views', 'index.html')); enviar html estatic
    res.render('index');
});
//montadoras
app.get('/listar_montadoras', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        try {
            let response = yield persistence_1.default.query('select * from montadoras');
            let montadoras = response.rows;
            res.render('listar', { montadoras });
        }
        catch (_a) {
            yield persistence_1.default.query('create table montadoras(id varchar primary key, nome varchar,pais varchar, ano_fundacao int)');
            yield persistence_1.default.query('create table modelos(id varchar primary key,id_montadora varchar references montadoras(id),nome varchar,valor_ref int,motorizacao int,turbo boolean,automatico boolean);');
            let response = yield persistence_1.default.query('select * from montadoras');
            let montadoras = response.rows;
            res.render('listar', { montadoras });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao listar montadoras!');
    }
}));
app.get('/form', (req, res) => {
    res.render('form');
});
app.post('/montadoras_save', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { nome, pais, ano } = req.body;
    let id = (0, ulid_1.ulid)();
    try {
        yield persistence_1.default.query('insert into montadoras values($1, $2, $3, $4)', [id, nome, pais, ano]);
        res.redirect('/listar_montadoras');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao salvar montadora!');
    }
}));
app.post('/montadoras_delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.body;
    try {
        yield persistence_1.default.query('delete from montadoras where id ilike $1', [id]);
        res.redirect('/listar_montadoras');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao deletar montadora!');
    }
}));
app.get('/montadoras_editar/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let montadora_antiga = (yield persistence_1.default.query('select * from montadoras where id ilike $1', [id])).rows[0];
    let context = { 'montadora': montadora_antiga };
    res.render('editar', context);
}));
app.post('/montadoras_editar2/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let json = req.body;
    let novo_nome = json.nome;
    let novo_pais = json.pais;
    let novo_ano = json.ano;
    try {
        let montadora_antiga = (yield persistence_1.default.query('select * from montadoras where id ilike $1', [id])).rows[0];
        if (!json.nome) {
            novo_nome = montadora_antiga.nome;
        }
        if (!json.pais) {
            novo_pais = montadora_antiga.pais;
        }
        if (!json.ano) {
            novo_ano = montadora_antiga.ano_fundacao;
        }
        yield persistence_1.default.query('update montadoras set nome = $1, pais = $2, ano_fundacao = $3 where id ilike $4', [novo_nome, novo_pais, novo_ano, id]);
        res.redirect('/listar_montadoras');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao editar montadora!');
    }
}));
app.get('/montadoras_detalhe/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let montadora = (yield persistence_1.default.query('select * from montadoras where id ilike $1', [id])).rows[0];
        res.render('detalhes', { montadora });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao detalharr montadora!');
    }
}));
//modelos
app.get('/listar_modelos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_montadora = req.params.id;
    let modelos;
    let montadora;
    try {
        if (id_montadora == '0') {
            let response = yield persistence_1.default.query('select * from modelos');
            modelos = response.rows;
        }
        else {
            let response = yield persistence_1.default.query('select * from modelos where id_montadora ilike $1', [id_montadora]);
            modelos = response.rows;
            let response2 = yield persistence_1.default.query('select * from montadoras where id ilike $1', [id_montadora]);
            montadora = response2.rows[0];
        }
        res.render('listar_modelos', { modelos, montadora });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao listar modelos!');
    }
}));
app.get('/modelos_delete/:id/:id_montadora', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let id_montadora = req.params.id_montadora;
    try {
        yield persistence_1.default.query('delete from modelos where id ilike $1', [id]);
        if (id_montadora == '0') {
            res.redirect('/listar_modelos/0');
        }
        else {
            res.redirect(`/listar_modelos/${id_montadora}`);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao deletar modelo!');
    }
}));
app.get('/modelos_detalhe/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let modelo = (yield persistence_1.default.query('select * from modelos where id ilike $1', [id])).rows[0];
        let montadora = (yield persistence_1.default.query('select * from montadoras where id ilike $1', [modelo.id_montadora])).rows[0];
        res.render('detalhes_modelo', { modelo, montadora });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao detalhar montadora!');
    }
}));
app.get('/form_modelos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id_montadora = req.params.id;
    if (id_montadora == '0') {
        let response = yield persistence_1.default.query('select * from montadoras');
        let montadoras = response.rows;
        res.render('form_modelos', { montadoras });
    }
    else {
        let response = yield persistence_1.default.query('select * from montadoras where id ilike $1', [id_montadora]);
        let montadoras = response.rows;
        res.render('form_modelos', { montadoras });
    }
}));
app.post('/modelos_save', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id_montadora, nome, valor_ref, motorizacao, turbo, automatico } = req.body;
    let id = (0, ulid_1.ulid)();
    try {
        yield persistence_1.default.query('insert into modelos values($1, $2, $3, $4, $5, $6, $7)', [id, id_montadora, nome, valor_ref, motorizacao, turbo, automatico]);
        res.redirect('/listar_modelos/0');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao salvar modelo!');
    }
}));
app.get('/modelos_editar/:id/:id_montadora', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const id_montadora_antiga = req.params.id_montadora;
    let modelo_antigo = (yield persistence_1.default.query('select * from modelos where id ilike $1', [id])).rows[0];
    let response = yield persistence_1.default.query('select * from montadoras');
    let montadoras = response.rows;
    let context = { 'modelo': modelo_antigo,
        'montadoras': montadoras,
        'id_montadora_antiga': id_montadora_antiga
    };
    res.render('editar_modelo', context);
}));
app.post('/modelos_editar2/:id/:id_montadora', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_modelo = req.params.id;
    const id_montadora_antiga = req.params.id_montadora;
    let json = req.body;
    let novo_id_montadora = json.montadora;
    let novo_nome = json.nome;
    let novo_valor_ref = json.valor_ref;
    let novo_motorizacao = json.motorizacao;
    let novo_turbo = json.turbo;
    let novo_automatico = json.automatico;
    try {
        let modelo_antigo = (yield persistence_1.default.query('select * from modelos where id ilike $1', [id_modelo])).rows[0];
        if (!json.montadora) {
            novo_id_montadora = modelo_antigo.id_montadora;
        }
        if (!json.nome) {
            novo_nome = modelo_antigo.nome;
        }
        if (!json.valor_ref) {
            novo_valor_ref = modelo_antigo.valor_ref;
        }
        if (!json.motorizacao) {
            novo_motorizacao = modelo_antigo.motorizacao;
        }
        yield persistence_1.default.query('update modelos set id_montadora = $1 ,nome = $2, valor_ref = $3, motorizacao = $4, turbo = $5, automatico = $6 where id ilike $7', [novo_id_montadora, novo_nome, novo_valor_ref, novo_motorizacao, novo_turbo, novo_automatico, id_modelo]);
        if (id_montadora_antiga == '0') {
            res.redirect('/listar_modelos/0');
        }
        else {
            res.redirect(`/listar_modelos/${id_montadora_antiga}`);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('erro ao editar modelo!');
    }
}));
app.listen(3000, () => {
    console.log(`Servidor rodando na porta 3000`);
});
//Não é possivel criar composiçao de paginas em blocos semelhante ao jinja com fastApi.
