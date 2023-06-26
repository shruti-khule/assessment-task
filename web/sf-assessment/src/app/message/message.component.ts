import { Component, Input } from '@angular/core';
import { ChatMessage } from '../parser/types';
import { FormControl } from '@angular/forms';
import { ProcessParser } from '../parser/process-parser';

import axios from 'axios';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],

})
export class MessageComponent {
  name = 'Angular';

  @Input() message?: ChatMessage;

  @Input() last: boolean = false;

  @Input() parser?: ProcessParser;

  control = new FormControl();
  states: string[] | undefined;
  isSignNode = false

  ngOnInit(): void {
    console.log("vbskfbivsbvk", this.parser?.visitor?.currentNode?.type)
    this.isSignNode = this.parser?.visitor?.currentNode?.type === "SignNode"
  }


  loadStates() {
    var allStates = this.parser?.visitor?.currentNode?.node.config?.['answer'].value
    this.control.valueChanges.pipe().subscribe(d => {
      this.states = allStates?.filter((state: string) => state?.toLowerCase().includes(d?.toLowerCase()!))
    })


  }



  async sendAnswer() {
    function postData(url: string, data: any) {
      return axios.post(url, data)
        .then(function (response: any) {
          return response.data;
        })
        .catch(function (error: any) {
          throw error;
        });
    }

    var url = 'http://localhost:1337/process';
    var data = {
      _id: this.message?.associatedBlock?.id,
      answer: this.control.value
    };

    postData(url, data)
      .then(function (response) {
        response = response
      })
      .catch(function (_error) {
      });

    var respone = await this.parser?.reply({
      content: {
        value: this.control.value,
      },
      id: `${this.message?.id}_reply`,
    });
  }

  async sendSign() {
    function postData(url: string, data: any) {
      return axios.post(url, data)
        .then(function (response: any) {
          return response.data;
        })
        .catch(function (error: any) {
          throw error;
        });
    }

    var url = 'http://localhost:1337/process/sign';
    var data = {
      _id: this.message?.associatedBlock?.id,
      answer: this.control.value
    };
    let imageElement = document.getElementById('myCanvas') as HTMLCanvasElement;
    let image = imageElement.toDataURL("image/png")


    const formData: FormData = new FormData();
    formData.append('image', image);

    axios.post( url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(async (response) => {
      console.log(response.data)
      var respone = await this.parser?.reply({
        content: {
          value: response.data,
        },
        id: `${this.message?.id}_reply`,
      });
      // Handle response from the server
    })
    .catch((error) => {
      console.error(error);
      // Handle error
    });

    // var respone = await this.parser?.reply({
    //   content: {
    //     value: filename,
    //   },
    //   id: `${this.message?.id}_reply`,
    // });
  }

  async deleteAnswer(_state: any) {
    async function deleteData(url: string, data: any) {
      var config = {
        method: 'delete',
        url: url,
        data: data
      };
      return axios.delete(url, config)
        .then(function (response: any) {
          return response.data;
        })
        .catch(function (error: any) {
          throw error;
        });
    }

    var url = 'http://localhost:1337/process';
    var data = {
      _id: this.message?.associatedBlock?.id,
      deleteAnswer: _state
    };


    deleteData(url, data)
      .then(function (response) {
        response = response
      })
      .catch(function (_error) {
      });
    window.location.reload();

  }

}
