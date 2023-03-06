from random import randrange
import numpy as np
import matplotlib.pyplot as plt



permission = []
idades = [18, 32, 55]

def verificaidade(idades, permission):
    for idade in idades:
        if idade >= 18:
            permission.append(True)
        else:
            permission.append(False)



verificaidade(idades, permission)

print(permission)

notas_matematicas = []

for notas in range(8):
    notas_matematicas.append(randrange(0,10))

print(notas_matematicas)

x = list(range(1,9))
print(x)
y = notas_matematicas
plt.plot(x , y)
