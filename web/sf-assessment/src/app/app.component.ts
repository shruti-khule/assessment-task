import { Component, OnInit } from '@angular/core';
import { ProcessParser } from './parser/process-parser';
import { nodes } from './process-template';
import { SketchParser } from './sketch-parser';
import { ChatMessage } from './parser/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public parser: ProcessParser = new ProcessParser();

  messages: ChatMessage[] = [];
  images!: string;

  constructor() {
    this.parser.reset();
    this.parser.onMessage.subscribe((chat) => {
      this.messages = chat;
    });
  }

  ngOnInit(): void {
    this.getProcess();
  }

  private async getProcess() {
    const nodes = await fetch(`http://localhost:1337/process`).then(resp => resp.json());
    this.parser.setupThread(nodes.map((n: any) => ({
      ...n,
      node: SketchParser.buildNode(n.type, n.config)
    })));
    this.parser.start(() => {
      alert('Process finished!');
    });
  }
}
