
import * as go from "gojs";

export class DrawComponent {

    diagram: any;

    constructor() {
    }

    draw(parser, divId) {
        let $ = go.GraphObject.make;
        this.diagram = this.createDiagram($, divId);
        this.diagram.nodeTemplate = this.getNodeTemplate($);
        this.diagram.nodeTemplateMap.add("LinkLabel", this.getLinkLabelTemplate($));
        this.diagram.groupTemplate = this.getGroupTemplate($);
        this.diagram.linkTemplate = this.getLinkTemplate($);
        this.diagram.model = this.getModel(parser);
    }

    private createDiagram($, divId) {
        let thisObject = this;
        let diagram =
            $(go.Diagram, divId,
                {
                    contentAlignment: go.Spot.Center,
                    "InitialLayoutCompleted": function (e) { thisObject.loadControls(e.diagram); }
                });
        return diagram;
    }


    private loadControls(diagram) {
        diagram.links.each(function (link) {
            let arr = link.data.controls;
            if (!Array.isArray(arr) || arr.length < 4) return;
            let from = link.fromPort;
            let to = link.toPort;
            if (from === null || to === null) return;
            if (arr.length === 4) {
                let c1 = new go.Point(arr[0], arr[1]);
                let c2 = new go.Point(arr[2], arr[3]);
                let p1 = link.getLinkPointFromPoint(from.part, from, from.getDocumentPoint(go.Spot.Center), c1, true);
                let p2 = link.getLinkPointFromPoint(to.part, to, to.getDocumentPoint(go.Spot.Center), c2, false);
                let list = new go.List();
                list.add(p1);
                list.add(c1);
                list.add(c2);
                list.add(p2);
                link.points = list;
            } else if (arr.length === 6) {
                let c1 = new go.Point(arr[0], arr[1]);
                let c2 = new go.Point(arr[2], arr[3]);
                let p2 = new go.Point(arr[4], arr[5]);
                let p1 = link.getLinkPointFromPoint(from.part, from, from.getDocumentPoint(go.Spot.Center), c1, true);
                let list = new go.List();
                list.add(p1);
                list.add(c1);
                list.add(c2);
                list.add(p2);
                link.points = list;
            }
        });
    }

    private getLinkLabelTemplate($) {
        let linkLabelTemplate = $(go.Node,
            {
                locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
                layerName: "Foreground",
                selectionAdorned: false
            },  // always have link label nodes in front of Links
            $(go.TextBlock,                   // this is a Link label
                new go.Binding("text", "text"))
        );
        return linkLabelTemplate;
    }



    private getNodeTemplate($) {
        let nodeTemplate =
            $(go.Node, "Vertical",
                {
                    locationSpot: go.Spot.Center,  // Node.location is the center of the Shape
                    locationObjectName: "SHAPE",
                    selectionAdorned: false
                },
                $(go.TextBlock, { stroke: "white", margin: 2 },
                    new go.Binding("text"), new go.Binding("numberOfInstances")),
                $(go.Shape, "Ellipse",
                    {
                        name: "SHAPE",
                        strokeWidth: 2,
                        desiredSize: new go.Size(30, 30),
                        portId: ""
                    },
                    new go.Binding("fill", "fill"), new go.Binding("stroke", "stroke")
                ),
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
            );
        return nodeTemplate;
    }

    private getGroupTemplate($) {
        let groupTemplate =
            $(go.Group, "Auto",
                $(go.Shape, "Rectangle",
                    { fill: "rgba(0,0,128,0.45)" }),
                $(go.Panel, "Vertical",
                    {
                        margin: 5,
                        defaultAlignment: go.Spot.Center
                    },
                    $(go.TextBlock, { alignment: go.Spot.Center, font: "Bold 12pt Sans-Serif" },
                        new go.Binding("text", "text")),
                    $(go.Placeholder), { padding: 5 }
                )
            );
        return groupTemplate;
    }


    private getLinkTemplate($) {
        let linkTemplate =
            $(go.Link,
                { curve: go.Link.Bezier, adjusting: go.Link.Stretch, reshapable: true },
                $(go.Shape, new go.Binding("stroke", "strokeLink")),
                $(go.Shape, { toArrow: "Standard" }, new go.Binding("fill", "fillArrow"), new go.Binding("stroke", "strokeArrow"))
            );
        return linkTemplate;
    }

    private getModel(parser) {
        let data = {
            "class": "go.GraphLinksModel",
            "linkLabelKeysProperty": "labelKeys",
            "nodeDataArray": parser.nodeDataArray,
            "linkDataArray": parser.linkDataArray
        };
        return go.Model.fromJson(data);
    }
}




