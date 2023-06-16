--tabla Codigos
create table Codigo(
    --primero codigo de persona
    codigo1 char(2) not null,
    --luego el codigo de palabra
    codigo2 char(2) not null,
    foreign key (codigo1) references Usuario(codigo),
    foreign key (codigo2) references Palabra(codigo), 
    primary key (codigo1,codigo2)
);
