sangre_fria(reptil).
tiene_exoesqueleto(artropodo).
marinos(molusco).
nacen_agua(anfibio).
tiene_cola(anfibio).
tiene_escama(reptil).
viven_agua(pez).
ponen_huevos(pez).
tienen_alas(ave).
pueden_volar(ave).
sangre_caliente(mamifero).
toman_leche(mamifero).
longevidad_baja(X):- X < 10.
longevidad_media(X):- X >= 10, X =< 60.
longevidad_alta(X):- X > 60.
extinta(X):- X == 0.
vulnerable(X):- X < 5000.
no_peligro(X):- X >= 5000.
animal_grande(X,Y):- X > 50, Y > 1.
animal_lento(X):- X < 1.
animal_rapido(X):- X > 10.
animal_normal(X):- \+ animal_lento(X), \+ animal_rapido(X).
tiene_vida(_):- true.
puede_respirar(_):- true.
tiene_hueso(vertebrado).
puede_sentir():- true.
