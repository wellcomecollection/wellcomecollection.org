// @flow
import type {Person} from '../model/person';
import * as people from '../data/people';

export const authorMap: { [key: string]: Person } = {
  'oops-i-wrote-a-britney-blog-post': people.russellDornan,
  'something-in-the-air': people.ruthGarde,
  'thunderbolts-and-lightning': people.ruthGarde,
  'eels-and-feels': people.ruthGarde,
  'charged-bodies': people.ruthGarde,
  'the-current-that-kills': people.ruthGarde,
  'dazzling-luxury': people.ruthGarde,
  'titans-in-the-landscape': people.ruthGarde,
  'john-gerrard-frogs-in-space': people.chrisChapman,
  'bill-morrison-domesticating-electricity': people.chrisChapman,
  'a-body-apart-from-the-head': people.robertBidder,
  'inspired-tattoos-as-pain-relief': people.rockWebb,
  'obsessed-with-buffy-much': people.russellDornan,
  'the-adamson-collection-5womenartists': people.russellDornan,
  'the-phenomenal-dr-price': people.sarahBentley,
  'varieties-of-love': people.sarahJaffray,
  'the-ladies-of-llangollen': people.sarahBentley,
  'queer-territory-claude-cahun-and-a-land-without-labels': people.sarahJaffray,
  'demodicid-navigation': people.robertBidder,
  'body-squabbles-crisps': people.robertBidder,
  'body-squabbles-foot': people.robertBidder,
  'body-squabbles-thirst': people.robertBidder,
  'museums-in-context-the-birth-of-the-public-museum': people.elissavetNtoulia,
  'the-electric-age': people.lalitaKaplish,
  'electric-age-the-electrified-garden': people.lalitaKaplish,
  'electric-age-hairbrush-wars': people.brionyHudson,
  'electric-age-the-electropoise': people.helenBabbs,
  'electric-age-cornelius-b-harness-and-his-electropathic-belt': people.lalitaKaplish
};
