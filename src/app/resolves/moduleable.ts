import { Module } from '../module/module';

export interface Moduleable {
  getModule(): Module
}
