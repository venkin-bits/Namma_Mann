<Project name="Namma Mann" type="Hybrid AI Pest Advisory System">

    <Workflow>

        <Stage id="1" name="Frontend Interaction Layer">
            <Components>
                <Folder>frontend/</Folder>
                <File>index.html</File>
                <File>vite.config.js</File>
                <File>tailwind.config.js</File>
                <File>postcss.config.js</File>
            </Components>
            <Description>
                Provides a lightweight, mobile-friendly web interface for farmers to
                capture or upload crop leaf images and submit them for analysis.
            </Description>
        </Stage>

        <Stage id="2" name="Backend Orchestration Layer">
            <Components>
                <Folder>src/</Folder>
                <File>requirements.txt</File>
                <File>.env.example</File>
            </Components>
            <Description>
                Acts as the central decision controller that receives images from
                the frontend, manages API routing, and orchestrates the ML pipeline.
            </Description>
        </Stage>

        <Stage id="3" name="ML Inference Pipeline" nickname="Hybrid Brain">
            <Components>
                <Folder>ml/</Folder>
            </Components>

            <SubStage name="Pest Localization">
                <Model>YOLOv8-Nano</Model>
                <Role>
                    Detects and localizes pest regions on crop leaf images using
                    a lightweight, low-latency object detection model.
                </Role>
            </SubStage>

            <SubStage name="Pest Classification">
                <Model>XGBoost (ONNX)</Model>
                <Role>
                    Classifies the detected pest region into specific pest categories
                    such as Stem Borer or Aphids.
                </Role>
            </SubStage>
        </Stage>

        <Stage id="4" name="Confidence Gate & Safety Logic">
            <Logic>
                <Threshold value="70%" />
                <Condition type="HighConfidence">
                    <Action>Return AI-generated diagnosis</Action>
                </Condition>
                <Condition type="LowConfidence">
                    <Action>Invoke rule-based fallback system</Action>
                </Condition>
            </Logic>
            <Description>
                Prevents unreliable predictions by enforcing a confidence-based
                decision gate, ensuring farmer safety.
            </Description>
        </Stage>

        <Stage id="5" name="Rule-Based Fallback System">
            <DataSource>
                <Institution>Tamil Nadu Agricultural University (TNAU)</Institution>
                <KnowledgeType>Indigenous Technical Knowledge (ITK)</KnowledgeType>
            </DataSource>
            <Remedies>
                <Remedy name="Neem Oil">Effective against soft-bodied insects</Remedy>
                <Remedy name="Chili-Garlic Paste">Repels borers naturally</Remedy>
                <Remedy name="Sticky Traps">Mechanical pest control method</Remedy>
            </Remedies>
        </Stage>

        <Stage id="6" name="Deployment & Scalability">
            <Components>
                <Folder>deploy/</Folder>
            </Components>
            <Capabilities>
                <Capability>Cloud-ready deployment</Capability>
                <Capability>Horizontal scalability</Capability>
                <Capability>Pest heat-map generation</Capability>
                <Capability>Community alert system</Capability>
                <Capability>Future carbon credit integration</Capability>
            </Capabilities>
        </Stage>

    </Workflow>

    <Impact>
        <Speed>~3 second end-to-end inference</Speed>
        <Safety>Soil-safe, non-chemical recommendations</Safety>
        <Alignment>
            <Policy>Digital Agriculture Mission</Policy>
            <Policy>PM-PRANAM</Policy>
            <Policy>Tamil Mann Valam</Policy>
        </Alignment>
    </Impact>

</Project>