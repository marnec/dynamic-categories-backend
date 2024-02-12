import { faker } from '@faker-js/faker';
import { isDefined } from 'class-validator';
import { MigrationInterface, QueryRunner } from 'typeorm';

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

export class AddData1707596077216 implements MigrationInterface {
  name = 'AddData1707596077216';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categories = [
      {
        name: 'videogames',
        generate: {
          itemName: () => `videogame-${faker.music.songName()}`
        }
      },
      {
        name: 'cpus',
        generate: {
          itemName: () => `cpu-${faker.commerce.productName()}`
        }
      },
      {
        name: 'miniatures',
        generate: {
          itemName: () => `miniature-${faker.person.fullName()}`
        }
      }
    ] as const;

    const properties = [
      {
        name: 'DRM',
        category: { name: 'videogames' },
        type: 'boolean',
        metadata: { type: 'boolean' }
      },
      {
        name: 'price',
        category: { name: 'videogames' },
        type: 'number',
        metadata: { type: 'number', min: 0, max: 100 }
      },
      {
        name: 'edition',
        category: { name: 'videogames' },
        type: 'freeChoice',
        metadata: { type: 'freeChoice' },
        hint: { type: 'string', choices: ['GOTY', 'standard', 'season-pass', 'dlc'] }
      },
      {
        name: 'genre',
        category: { name: 'videogames' },
        type: 'constrainedChoice',
        metadata: {
          type: 'constrainedChoice',
          choices: ['rts', 'rpg', 'fps', 'mmo', 'tps', 'adventure']
        }
      },
      {
        name: 'boxed',
        category: { name: 'cpus' },
        type: 'boolean',
        metadata: { type: 'boolean' }
      },
      {
        name: 'price',
        category: { name: 'cpus' },
        type: 'number',
        metadata: { type: 'number', min: 0, max: 1000 }
      },
      {
        name: 'cores',
        category: { name: 'cpus' },
        type: 'freeChoice',
        metadata: { type: 'freeChoice' },
        hint: { type: 'number', min: 0, max: 64, step: 2 }
      },
      {
        name: 'brand',
        category: { name: 'cpus' },
        type: 'constrainedChoice',
        metadata: {
          type: 'constrainedChoice',
          choices: ['Intel', 'AMD']
        }
      },
      {
        name: 'material',
        category: { name: 'miniatures' },
        type: 'constrainedChoice',
        metadata: {
          type: 'constrainedChoice',
          choices: ['PLA', 'ABS', 'Carbon fiber']
        }
      },
      {
        name: 'color',
        category: { name: 'miniatures' },
        type: 'freeChoice',
        metadata: {
          type: 'freeChoice',
          viewMode: 'color'
        },
        hint: {
          type: 'string',
          choices: [
            '#F5CCA0',
            '#E48F45',
            '#994D1C',
            '#6B240C',
            '#EEEEEE',
            '#A3C9AA',
            '#C68484',
            '#9B4444'
          ]
        }
      }
    ];

    for (const category of categories) {
      await queryRunner.query('INSERT INTO categories (name) values ($1)', [category.name]);
    }

    for (const property of properties) {
      await queryRunner.query(
        `
      INSERT INTO properties (category, name, type, metadata) values (
        (select id from categories where name = $1), $2, $3, $4)`,
        [property.category.name, property.name, property.type, JSON.stringify(property.metadata)]
      );
    }

    for (const category of categories) {
      await Promise.all(
        Array(1000)
          .fill(0)
          .map(() =>
            queryRunner.query(
              `INSERT INTO "item-categories" ("name", "templateCategory", "inSync") values 
              ($1, 
              (SELECT id from categories where name = $2), true)`,
              [category.name, category.name]
            )
          )
      );

      const itemCategories = await queryRunner.query(
        'SELECT * FROM "item-categories" where name = $1',
        [category.name]
      );

      await Promise.all(
        itemCategories.map(({ id }) =>
          queryRunner.query(`INSERT INTO "items" (name, category) values ($1, $2)`, [
            category.generate.itemName(),
            id
          ])
        )
      );

      for (const itemCategory of itemCategories) {
        for (const property of properties.filter((p) => p.category.name === category.name)) {
          await queryRunner.query(
            `
          INSERT INTO "item-properties" ("name", "item-category", "type", "metadata") VALUES (
            $1, $2, $3, $4
          )
          `,
            [
              property.name,
              itemCategory.id,
              property.type,
              JSON.stringify(generateMetdata(property.metadata, property.hint))
            ]
          );
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE
    "item-categories",
    "items",
    "categories",
    "item-properties",
    "properties"`);
  }
}

const generateMetdata = (metadata: any, hint: any) => {
  metadata = { ...metadata };

  let value;
  if (metadata.type === 'number') {
    value = Math.floor(Math.random() * 10000);

    const { max, min } = metadata;
    if (isDefined(min) && isDefined(max)) {
      value = Math.floor(Math.random() * (max - min + 1) + min);
    }
  } else if (metadata.type === 'freeChoice') {
    if (!hint) {
      throw new Error();
    }

    if (hint.type === 'number') {
      const { max, min, step } = hint;

      if (isDefined(step)) {
        const choices = range(min, max, step);
        value = choices[Math.floor(Math.random() * choices.length)];
      } else if (isDefined(min) && isDefined(max)) {
        value = Math.floor(Math.random() * (max - min + 1) + min).toString();
      }
    } else if (hint.type === 'string') {
      value = hint.choices[Math.floor(Math.random() * hint.choices.length)];
    }
  } else if (metadata.type === 'constrainedChoice') {
    value = metadata.choices[Math.floor(Math.random() * metadata.choices.length)];
  } else if (metadata.type === 'boolean') {
    const choices = [true, false];
    value = choices[Math.floor(Math.random() * choices.length)];
  }

  metadata.value = value;

  for (const key of Object.keys(metadata)) {
    if (!['value', 'type'].includes(key)) {
      delete metadata[key];
    }
  }

  return metadata;
};
