--tabla Codigos
create table Codigo(
    --primero codigo de persona
    codigo1 INTEGER not null,
    --luego el codigo de palabra
    codigo2 INTEGER not null,
    foreign key (codigo1) references Usuario(codigo),
    foreign key (codigo2) references Palabra(codigo), 
    primary key (codigo1,codigo2)
);
