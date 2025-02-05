# Thème

Vous pouvez modifier l'apparence de votre client CherryPick à l'aide de thèmes.

## Paramètres de thème
Paramètres > Thèmes

## Créer un thème
Le code des thèmes est écrit sous forme d'objets JSON5. Les thèmes comprennent les objets suivants :
``` js
{
    id: '17587283-dd92-4a2c-a22c-be0637c9e22a',

    name: 'Danboard',
    author: 'syuilo',

    base: 'light',

    props: {
        accent: 'rgb(218, 141, 49)',
        bg: 'rgb(218, 212, 190)',
        fg: 'rgb(115, 108, 92)',
        panel: 'rgb(236, 232, 220)',
        renote: 'rgb(100, 152, 106)',
        link: 'rgb(100, 152, 106)',
        mention: '@accent',
        hashtag: 'rgb(100, 152, 106)',
        header: 'rgba(239, 227, 213, 0.75)',
        navBg: 'rgb(216, 206, 182)',
        inputBorder: 'rgba(0, 0, 0, 0.1)',
    },
}

```

* `id` ... L'identifiant unique du thème. L'utilisation d'un UUID est recommandée ;
* `name` ... Nom du thème ;
* `author` ... Auteur du thème ;
* `desc` ... Description du thème (facultatif) ;
* `base` ... Thème clair ou sombre :
    * Sélectionnez `light` pour définir le thème comme thème clair et `dark` pour le définir comme sombre,
    * Le thème héritera des valeurs par défaut du thème spécifié ici ;
* `props` ... Définir un style de thème.Voir les explications ci-après.

### Définir un style de thème
C'est dans `props` que vous définirez le style du thème. Les clés deviendront des noms de variables CSS dont le contenu sera spécifié par les valeurs associées. Par ailleurs, les objets présents par défaut dans `props` sont hérités du thème de base. Ainsi, si le thème de `base` est `clair`, ce sera le fichier [_light.json5](https://github.com/kokonect-link/cherrypick/blob/develop/src/client/themes/_light.json5) ; et s'il est `sombre`, le fichier [_dark.json5](https://github.com/kokonect-link/cherrypick/blob/develop/src/client/themes/_dark.json5). En bref, s'il n'y a, par exemple, pas de clé `panel` définie dans les `props` du thème, alors ce sera la valeur `panel` du thème de base qui sera prise en compte.

#### Syntaxe des valeurs
* Codes de couleur Hex
    * Ex. : `#00ff00`
* Couleurs avec les valeurs RVB : `rgb(r, g, b)`
    * Ex. : `rgb(0, 255, 0)`
* Couleurs avec les valeurs RVBA : `rgba(r, g, b, a)`
    * Ex. : `rgba(0, 255, 0, 0.5)`
* Appeler les valeurs d'autres clés
    * Entrer `@{keyname}` pour appeler la valeur d'une autre clé. Remplacer alors `{keyname}` par le nom de la clé que vous souhaitez appeler.
    * Ex. : `@panel`
* Constantes (voir ci-dessous)
    * Entrer `${constantname}` vous permet d'appeler une constante. Remplacer alors `{constantname}` par le nom de la constante que vous souhaitez appeler.
    * Ex. : `$main`
* Fonctions (voir ci-dessous)
    * `:{functionname}<{argument}<{color}`

#### Constantes
Dans le cas où vous ne souhaiteriez pas qu'une valeur génère une variable CSS mais que vous voudriez l'utiliser comme valeur pour une autre variable CSS, vous avez la possibilité d'utiliser une constante. Il suffit de faire précéder le nom de la propriété de : `$` pour que celle-ci ne génère pas de variable CSS.

#### Fonctions
wip
